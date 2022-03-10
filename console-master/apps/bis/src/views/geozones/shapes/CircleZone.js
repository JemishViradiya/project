import isEqual from 'lodash-es/isEqual'
import PropTypes from 'prop-types'
import { memo, useMemo } from 'react'

import { useTheme } from '@material-ui/core/styles'

import Circle from '../../../googleMaps/Circle'
import { getDegreesPerMeter, getMetersPerPixel } from '../../../googleMaps/util'
import Colors from './Colors'
import Zone from './Zone'

const pick = ({
  background,
  zone: {
    id,
    name,
    geometry: {
      center: { lat, lon },
      radius,
    },
    risk,
    unit,
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
  lat,
  lon,
  radius,
  name,
  risk,
  unit,
  zoom,
  highlighted,
  onHighlightChanged,
  showPopup,
  onPopupClose,
  onZoneSelected,
  disableZoneSelection,
})

const CircleZone = memo(
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
      geometry: {
        center: { lat, lon },
        radius,
      },
      risk,
    } = zone
    const theme = useTheme()

    const useIcon = useMemo(() => {
      const metersPerPixel = getMetersPerPixel(lat, zoom)
      // See https://groups.google.com/forum/#!topic/google-maps-js-api-v3/hDRO4oHVSeM
      const pixelDiameter = (2 * radius) / metersPerPixel
      return pixelDiameter <= 24
    }, [lat, zoom, radius])

    const options = useMemo(() => {
      return {
        center: {
          lat,
          lng: lon,
        },
        radius,
        ...Colors.style(risk, theme),
      }
    }, [lat, lon, radius, risk, theme])

    const highlightOptions = useMemo(
      () => ({
        center: {
          lat: lat,
          lng: lon,
        },
        clickable: false,
        radius,
        ...Colors.hoverStyle(theme),
      }),
      [lat, lon, radius, theme],
    )

    const [popupLatLng, invertedPopupLatLng] = useMemo(() => {
      const radiusInDegrees = getDegreesPerMeter(radius)
      return [
        {
          lat: () => lat + radiusInDegrees,
          lng: () => lon,
        },
        {
          lat: () => lat - radiusInDegrees,
          lng: () => lon,
        },
      ]
    }, [lat, lon, radius])

    const latlng = useMemo(
      () => ({
        lat: () => lat,
        lng: () => lon,
      }),
      [lat, lon],
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
      Shape: Circle,
      shapeOptions: options,
      highlightOptions,
      latlng,
      popupLatLng,
      invertedPopupLatLng,
      useIcon,
      onDeleteSingle,
    })
  },
  (prev, next) => {
    return isEqual(pick(prev), pick(next))
  },
)

CircleZone.propTypes = {
  ...Zone.propTypes,
  zone: PropTypes.shape({
    geometry: PropTypes.shape({
      radius: PropTypes.number.isRequired,
      center: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lon: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    risk: PropTypes.string.isRequired,
  }).isRequired,
}

CircleZone.defaultProps = Zone.defaultProps

CircleZone.displayName = 'CircleZone'

export default CircleZone
