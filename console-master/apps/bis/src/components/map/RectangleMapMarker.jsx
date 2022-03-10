import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import MapContext from '../../googleMaps/Context'
import { default as Marker } from '../../googleMaps/Marker'
import MapPopup from '../../googleMaps/Popup'
import Rectangle from '../../googleMaps/Rectangle'
import { RiskLevel } from '../RiskLevel'
import shorten from '../util/shorten'
import ClusterPopup from './ClusterPopup'
import { HeatmapClusterIcon } from './MapIcon'
import UserMapPopup from './UserMapPopup'

const POPUP_OFFSET = { x: 0, y: -10 }
const USER_POPUP_OFFSET = { x: 0, y: -38 }

const RectangleMapMarker = memo(
  ({ cluster: { critical = 0, high = 0, medium = 0, low = 0, lat, lon: lng, count, bounds }, geoBounds, user, privacyModeOn }) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const boundsTheme = theme.custom.bisMap.bounds
    const { map } = useContext(MapContext)
    const [hover, setHover] = useState(false)
    const formattedCount = useMemo(() => shorten(count, t), [count, t])
    const color = RiskLevel.colorOfHighestMapPin(theme, critical, high, medium, low)
    const position = { lat, lng }
    const zIndex = useMemo(() => (hover ? theme.zIndex.bis.mapMarker.hovered : theme.zIndex.bis.mapMarker.normal), [
      hover,
      theme.zIndex.bis.mapMarker,
    ])
    const onHover = useCallback(hovered => setHover(hovered), [setHover])
    const mapIcon = useMemo(() => HeatmapClusterIcon({ color, count, formattedCount, hover, theme }), [
      color,
      count,
      formattedCount,
      hover,
      theme,
    ])

    const popupRef = useRef()
    const closePopup = useCallback(() => {
      if (popupRef.current) {
        popupRef.current.close()
      }
    }, [popupRef])
    const summary = useMemo(() => ({ critical, high, medium, low, total: count }), [count, critical, high, low, medium])
    const onClickFunctions = useMemo(() => {
      const f = () => map && map.zoomToClusterBounds([{ bounds }])
      return { gotoTotal: f }
    }, [bounds, map])

    const onHoverStart = useCallback(() => {
      setHover(true)
    }, [])
    const onHoverEnd = useCallback(() => {
      setHover(false)
    }, [])

    const renderBounds = () => {
      if (!geoBounds) return null
      const boundsOptions = {
        bounds: geoBounds,
        fillColor: RiskLevel.colorOfHighestMapBound(theme, critical, high, medium, low),
        fillOpacity: boundsTheme.fillOpacity,
        strokeColor: theme.palette.common.white,
        strokeOpacity: boundsTheme.strokeOpacity,
        strokeWeight: boundsTheme.strokeWeight,
      }
      return <Rectangle options={boundsOptions} onHoverStart={onHoverStart} onHoverEnd={onHoverEnd} />
    }

    const renderPopup = useMemo(() => {
      if (user) {
        return (
          <MapPopup offset={USER_POPUP_OFFSET} ref={popupRef} risk={user.riskLevel} privacyModeOn={privacyModeOn}>
            <UserMapPopup user={user} onClose={closePopup} />
          </MapPopup>
        )
      }
      return (
        <MapPopup offset={POPUP_OFFSET}>
          <ClusterPopup summary={summary} noBorder onClickFunctions={onClickFunctions} />
        </MapPopup>
      )
    }, [closePopup, onClickFunctions, summary, user, privacyModeOn])

    return (
      <div>
        {renderBounds()}
        <Marker
          icon={mapIcon}
          position={position}
          zIndexOffset={zIndex}
          zIndexMapMarkerHovered={theme.zIndex.bis.mapMarker.hovered}
          onHover={onHover}
        >
          {renderPopup}
        </Marker>
      </div>
    )
  },
)

RectangleMapMarker.propTypes = {
  cluster: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    critical: PropTypes.number.isRequired,
    high: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    low: PropTypes.number.isRequired,
  }).isRequired,
  geoBounds: PropTypes.object,
}

RectangleMapMarker.displayName = 'RectangleMapMarker'
export default RectangleMapMarker
