import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import MapContext from '../../googleMaps/Context'
import { default as Marker } from '../../googleMaps/Marker'
import MapPopup from '../../googleMaps/Popup'
import { getMetersPerPixel } from '../../googleMaps/util'
import styles from './SearchPin.module.less'

const POPUP_OFFSET = { x: 0, y: -30 }

const SearchPin = memo(({ location, onCircle, onPolygon, zoom }) => {
  const { t } = useTranslation()
  const { google, map } = useContext(MapContext)
  const theme = useTheme()

  // By default we draw a 40 pixel radius circle around the point.
  const drawCircle = useCallback(() => {
    const metersPerPixel = getMetersPerPixel(location.lat(), zoom)
    const circle = new google.maps.Circle({
      map,
      center: location,
      radius: 40 * metersPerPixel,
      fillColor: theme.palette.bis.risk.high,
      fillOpacity: 0.4,
      strokeColor: theme.palette.bis.risk.high,
      strokeWeight: 2,
    })
    onCircle(circle)
  }, [google.maps.Circle, location, map, onCircle, zoom, theme])

  // By default we draw a ~70x40 pixel rectangle around the point.
  const drawPolygon = useCallback(() => {
    const metersPerPixel = getMetersPerPixel(location.lat(), zoom)
    const northEast = google.maps.geometry.spherical.computeOffset(location, 40 * metersPerPixel, 60)
    const southWest = google.maps.geometry.spherical.computeOffset(location, 40 * metersPerPixel, 240)
    const polygon = new google.maps.Polygon({
      map,
      paths: [
        { lat: northEast.lat(), lng: southWest.lng() },
        { lat: northEast.lat(), lng: northEast.lng() },
        { lat: southWest.lat(), lng: northEast.lng() },
        { lat: southWest.lat(), lng: southWest.lng() },
      ],
      fillColor: theme.palette.bis.risk.high,
      fillOpacity: 0.4,
      strokeColor: theme.palette.bis.risk.high,
      strokeWeight: 2,
    })

    const bounds = new google.maps.LatLngBounds()
    polygon.getPath().forEach(latlng => bounds.extend(latlng))
    polygon.google = google
    onPolygon(polygon, bounds.getCenter())
  }, [google, location, map, onPolygon, zoom, theme])

  const locationLiteral = useMemo(
    () => ({
      lat: location.lat(),
      lng: location.lng(),
    }),
    [location],
  )

  return (
    <Marker position={locationLiteral} zIndexMapMarkerHovered={theme.zIndex.bis.mapMarker.hovered} riseOnHover>
      <MapPopup autopan maxWidth={400} offset={POPUP_OFFSET}>
        <div>
          <div role="button" tabIndex="-1" className={styles.item} onClick={drawCircle}>
            {t('geozones.searchAddCircularGeozone')}
          </div>
          <div role="button" tabIndex="-1" className={styles.item} onClick={drawPolygon}>
            {t('geozones.searchAddShapedGeozone')}
          </div>
        </div>
      </MapPopup>
    </Marker>
  )
})

SearchPin.displayName = 'SearchPin'

SearchPin.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.func.isRequired,
    lng: PropTypes.func.isRequired,
  }).isRequired,
  onCircle: PropTypes.func.isRequired,
  onPolygon: PropTypes.func.isRequired,
  zoom: PropTypes.number,
}

SearchPin.defaultProps = {
  zoom: 1,
}

export default SearchPin
