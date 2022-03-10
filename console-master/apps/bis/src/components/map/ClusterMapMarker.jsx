import PropTypes from 'prop-types'
import React, { forwardRef, useCallback, useContext, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import shorten from '../../components/util/shorten'
import MapContext from '../../googleMaps/Context'
import { default as Marker } from '../../googleMaps/Marker'
import MapPopup from '../../googleMaps/Popup'
import { RiskLevel } from '../RiskLevel'
import ClusterPopup from './ClusterPopup'
import { MapChartClusterIcon } from './MapIcon'

const POPUP_OFFSET = { x: 0, y: -10 }

const ClusterMapMarker = forwardRef(
  ({ cluster: { critical = 0, high = 0, medium = 0, low = 0, lat, lon: lng, geohash, bounds, count }, focused }, ref) => {
    const { t } = useTranslation()
    const [hover, setHover] = useState(false)
    const popupRef = useRef()
    const closePopup = useCallback(() => popupRef.current && popupRef.current.close(), [popupRef])
    const { map } = useContext(MapContext)
    useImperativeHandle(ref, () => ({ closePopup }))

    const formattedCount = useMemo(() => shorten(count, t), [count, t])
    const largeSize = hover || focused
    const theme = useTheme()
    const mapIcon = useMemo(
      () =>
        MapChartClusterIcon({
          color: RiskLevel.colorOfHighestRisk(theme, critical, high, medium, low),
          count,
          formattedCount,
          hover: largeSize,
          theme,
        }),
      [critical, high, medium, low, count, formattedCount, largeSize, theme],
    )
    const position = useMemo(() => ({ lat, lng }), [lat, lng])
    const zIndex = useMemo(() => (largeSize ? theme.zIndex.bis.mapMarker.hovered : theme.zIndex.bis.mapMarker.normal), [
      largeSize,
      theme.zIndex.bis.mapMarker,
    ])
    const onHover = useCallback(hovered => setHover(hovered), [setHover])
    const summary = useMemo(() => ({ critical, high, medium, low, total: count }), [count, critical, high, low, medium])
    const onClickFunctions = useMemo(() => {
      const gotoTotal = () => {
        map && map.zoomToClusterBounds([{ bounds }])
      }
      return { gotoTotal }
    }, [bounds, map])
    return (
      <Marker
        icon={mapIcon}
        key={`marker-${geohash}`}
        position={position}
        zIndexOffset={zIndex}
        zIndexMapMarkerHovered={theme.zIndex.bis.mapMarker.hovered}
        onHover={onHover}
      >
        <MapPopup ref={popupRef} offset={POPUP_OFFSET}>
          <ClusterPopup summary={summary} noBorder onClickFunctions={onClickFunctions} />
        </MapPopup>
      </Marker>
    )
  },
)

const Coordinates = PropTypes.shape({
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
})

const Bounds = PropTypes.shape({
  top_left: Coordinates.isRequired,
  bottom_right: Coordinates.isRequired,
})

ClusterMapMarker.propTypes = {
  cluster: PropTypes.shape({
    bounds: Bounds.isRequired,
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    critical: PropTypes.number.isRequired,
    high: PropTypes.number.isRequired,
  }).isRequired,
  focused: PropTypes.bool,
}

ClusterMapMarker.displayName = 'ClusterMapMarker'
export default ClusterMapMarker
