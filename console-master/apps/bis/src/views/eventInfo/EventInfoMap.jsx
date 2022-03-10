import PropTypes from 'prop-types'
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'

import UserMapMarker from '../../components/map/UserMapMarker'
import UserMapPopup from '../../components/map/UserMapPopup'
import { UnknownLocationInfo } from '../../components/UnknownLocation'
import { environment } from '../../environments/environment'
import { decode, encode, getBounds } from '../../googleMaps/geohash'
import Heatmap from '../../googleMaps/Heatmap'
import Map from '../../googleMaps/Map'
import { getPrecision } from '../../googleMaps/util'
import Geozones from '../../list/Geozones'
import GeozoneListProvider from '../../providers/GeozoneListProvider'
import { RiskLevel, useClientParams, useToggle } from '../../shared'
import styles from './EventInfoMap.module.less'

const mapConfig = environment.map
const MIN_AUTO_ZOOM = (mapConfig && mapConfig.zoom && mapConfig.zoom.minAutoZoom) || 2
const MAX_AUTO_ZOOM = (mapConfig && mapConfig.zoom && mapConfig.zoom.maxAutoZoom) || 18

// eslint-disable-next-line sonarjs/cognitive-complexity
const EventInfoMap = memo(({ riskEvent, eventId }) => {
  const { privacyMode } = useClientParams()
  const privacyModeOn = privacyMode && privacyMode.mode
  const maxZoom = privacyModeOn ? privacyMode.maxZoom : MAX_AUTO_ZOOM
  const location = riskEvent.assessment.location
  let noLocation = false
  if (Math.round(location.lat * 1000) === 0 || Math.round(location.lon * 1000) === 0) {
    noLocation = true
  }
  const defaultZoom = noLocation ? MIN_AUTO_ZOOM : maxZoom
  const [showDetails, toggleShowDetails] = useToggle(false)

  const local = useRef()
  let next = local.current
  if (!next || !next.eventId !== eventId) {
    const { lat, lon: lng } = riskEvent.assessment.location
    const viewport = {
      center: { lat, lng },
      zoom: next && next.viewport ? next.viewport.zoom : defaultZoom,
    }
    next = { viewport, eventId }
  } else {
    next = local.current
  }
  useEffect(() => {
    local.current = next
  }, [next])

  const zoom = next.viewport.zoom || defaultZoom
  const userData = useMemo(
    () => ({
      riskLevel: riskEvent.riskLevel,
      userId: riskEvent.assessment.eEcoId,
      info: riskEvent.assessment.userInfo,
      assessment: riskEvent.assessment,
      operatingMode: riskEvent.operatingMode,
      sisActions: riskEvent.sisActions,
    }),
    [riskEvent.assessment, riskEvent.operatingMode, riskEvent.riskLevel, riskEvent.sisActions],
  )

  const onViewportChanged = useCallback(vp => {
    local.current.viewport = vp
  }, [])

  const renderMapMarker = (riskEvent, zoom) => {
    if (privacyModeOn) {
      const maxPrecision = privacyMode.maxPrecision || 5
      const precision = getPrecision(maxPrecision, zoom)
      const geohash = encode(riskEvent.assessment.location.lat, riskEvent.assessment.location.lon, precision)
      const { lat, lon } = decode(geohash)
      const data = [
        {
          count: 1,
          critical: riskEvent.riskLevel === RiskLevel.CRITICAL ? 1 : 0,
          high: riskEvent.riskLevel === RiskLevel.HIGH ? 1 : 0,
          medium: riskEvent.riskLevel === RiskLevel.MEDIUM ? 1 : 0,
          low: riskEvent.riskLevel === RiskLevel.LOW ? 1 : 0,
          lat,
          lon,
          geohash,
          bounds: getBounds(geohash),
        },
      ]

      return <Heatmap data={data} zoom={zoom} user={userData} />
    } else {
      return <UserMapMarker user={userData} size="large" />
    }
  }

  const renderEventDetails = useMemo(() => {
    if (showDetails) {
      return (
        <div className={styles.eventInfo}>
          <UserMapPopup user={userData} onClose={toggleShowDetails} noStreetView />
        </div>
      )
    }
    return null
  }, [showDetails, toggleShowDetails, userData])

  const renderUnknownLocation = useMemo(() => {
    if (noLocation) {
      return (
        <div className={styles.info}>
          {renderEventDetails}
          <UnknownLocationInfo count={1} onClick={toggleShowDetails} />
        </div>
      )
    }
    return null
  }, [noLocation, renderEventDetails, toggleShowDetails])

  return (
    <GeozoneListProvider>
      <Map
        id="EventInfoMap"
        maxZoom={maxZoom}
        viewport={next.viewport}
        fullSize
        leftBottomNode={renderUnknownLocation}
        onViewportChanged={onViewportChanged}
      >
        <Geozones zoom={zoom} />
        {noLocation ? null : renderMapMarker(riskEvent, zoom)}
      </Map>
    </GeozoneListProvider>
  )
})

EventInfoMap.displayName = 'EventInfoMap'

EventInfoMap.propTypes = {
  eventId: PropTypes.string.isRequired,
  riskEvent: PropTypes.object.isRequired,
}

export default EventInfoMap
