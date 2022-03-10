import isEqual from 'lodash-es/isEqual'
import PropTypes from 'prop-types'
import { memo, useMemo } from 'react'

import { useTheme } from '@material-ui/core/styles'

import Polygon from '../../../googleMaps/Polygon'
import { Bounds, getMetersPerPixel } from '../../../googleMaps/util'
import Colors from './Colors'
import Zone from './Zone'

const pick = ({
  background,
  zone: {
    id,
    name,
    geometry: { coordinates },
    risk,
  },
  zoom,
  highlighted,
  onHighlightChanged,
  showPopup,
  onPopupClose,
  onZoneSelected,
  disableZoneSelection,
}) => ({
  background,
  id,
  name,
  coordinates,
  risk,
  zoom,
  highlighted,
  onHighlightChanged,
  showPopup,
  onPopupClose,
  onZoneSelected,
  disableZoneSelection,
})

const PolygonZone = memo(
  ({
    background,
    zone,
    zoom,
    highlighted,
    onHighlightChanged,
    showPopup,
    onPopupClose,
    onZoneSelected,
    disableZoneSelection,
    onDeleteSingle,
  }) => {
    const {
      geometry: { coordinates },
      risk,
    } = zone
    const theme = useTheme()
    const bounds = useMemo(() => {
      const bounds = new Bounds()
      let top = { lat: -90, lng: 0 }
      let bottom = { lat: 90, lng: 0 }
      coordinates.forEach(coord => {
        const point = { lat: coord[0], lng: coord[1] }
        bounds.extend(point)
        if (coord[0] > top.lat) {
          top = point
        }
        if (coord[0] < bottom.lat) {
          bottom = point
        }
      })
      return {
        center: bounds.getCenter(),
        width: bounds.getWidthMeters(),
        height: bounds.getHeightMeters(),
        topCenter: {
          lat: () => top.lat,
          lng: () => top.lng,
        },
        bottomCenter: {
          lat: () => bottom.lat,
          lng: () => bottom.lng,
        },
      }
    }, [coordinates])

    const useIcon = useMemo(() => {
      const metersPerPixel = getMetersPerPixel(bounds.center.lat(), zoom)
      return bounds.width / metersPerPixel <= 24 || bounds.height / metersPerPixel <= 24
    }, [bounds, zoom])

    const options = useMemo(
      () => ({
        paths: coordinates.map(coord => ({
          lat: coord[0],
          lng: coord[1],
        })),
        ...Colors.style(risk, theme),
      }),
      [coordinates, risk, theme],
    )

    const highlightOptions = useMemo(
      () => ({
        paths: coordinates.map(coord => ({
          lat: coord[0],
          lng: coord[1],
        })),
        clickable: false,
        ...Colors.hoverStyle(theme),
      }),
      [coordinates, theme],
    )

    return Zone({
      background,
      zone,
      highlighted,
      onHighlightChanged,
      onZoneSelected,
      disableZoneSelection,
      showPopup,
      onPopupClose,
      Shape: Polygon,
      shapeOptions: options,
      highlightOptions,
      latlng: bounds.center,
      popupLatLng: bounds.topCenter,
      invertedPopupLatLng: bounds.bottomCenter,
      useIcon,
      onDeleteSingle,
    })
  },
  (prev, next) => {
    return isEqual(pick(prev), pick(next))
  },
)

PolygonZone.propTypes = {
  ...Zone.propTypes,
  zone: PropTypes.shape({
    geometry: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    }).isRequired,
    risk: PropTypes.string.isRequired,
  }).isRequired,
}

PolygonZone.defaultProps = Zone.defaultProps

PolygonZone.displayName = 'PolygonZone'

export default PolygonZone
