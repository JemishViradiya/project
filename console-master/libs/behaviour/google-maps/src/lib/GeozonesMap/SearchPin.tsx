import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { useTheme } from '@material-ui/core/styles'

import type { PositionFunc } from '../GoogleMaps'
import { useGoogleMapContext } from '../GoogleMaps'
import Popup from '../Popup'
import { default as Marker, useMarkerContext } from './Marker'
import type { GeozoneShape } from './model'
import { GeozoneType } from './model'
import MiniIcon from './shapes/MiniIcon'
import { useShapeStyle } from './utils/use-shape-style'
import { getMetersPerPixel } from './utils/util'

interface SearchPinProps {
  location: PositionFunc
  name: string
  zoom: number
  onShapeCreated: (shape: GeozoneShape, type: GeozoneType) => void
}

const SearchPin: React.FC<SearchPinProps> = memo(({ location, name, ...rest }) => {
  const { t } = useTranslation('behaviour/geozones-map')
  const locationLiteral = useMemo(
    () => ({
      lat: location.lat(),
      lng: location.lng(),
    }),
    [location],
  )

  const [popupOpen, setPopupOpen] = useState(false)

  const onPinClick = useCallback(() => {
    setPopupOpen(true)
  }, [])

  const onPopupClose = useCallback(() => {
    setPopupOpen(false)
  }, [])

  const shapeStyle = useShapeStyle()
  const icon = useMemo(() => MiniIcon({ defaultPin: true, highlighted: false, fillColor: shapeStyle.fillColor }), [
    shapeStyle.fillColor,
  ])

  return (
    <Marker icon={icon} title={t('marker.searchAriaLabel', { name })} position={locationLiteral} riseOnHover onClick={onPinClick}>
      <SearchPinPopup open={popupOpen} onClose={onPopupClose} location={location} {...rest} />
    </Marker>
  )
})

interface SearchPinPopupProps extends Omit<SearchPinProps, 'name'> {
  open: boolean
  onClose: () => void
}

const SearchPinPopup: React.FC<SearchPinPopupProps> = memo(({ open, onClose, location, zoom, onShapeCreated }) => {
  const { t } = useTranslation('behaviour/geozones-map')
  const { google, map } = useGoogleMapContext()
  const { marker } = useMarkerContext()
  const { spacing } = useTheme()
  const popupOffset = useMemo(() => ({ x: 0, y: -spacing(7) }), [spacing])
  const shapeStyle = useShapeStyle()

  // By default we draw a 40 pixel radius circle around the point.
  const drawCircle = useCallback(() => {
    const metersPerPixel = getMetersPerPixel(location.lat(), zoom)
    const circle = new google.maps.Circle({
      map,
      center: {
        lat: location.lat(),
        lng: location.lng(),
      },
      radius: 40 * metersPerPixel,
      ...shapeStyle,
    })
    onShapeCreated(circle, GeozoneType.Circle)
  }, [location, zoom, google, map, onShapeCreated, shapeStyle])

  // By default we draw a ~70x40 pixel rectangle around the point.
  const drawPolygon = useCallback(() => {
    const metersPerPixel = getMetersPerPixel(location.lat(), zoom)
    const northEast = google.maps.geometry.spherical.computeOffset(location as google.maps.LatLng, 40 * metersPerPixel, 60)
    const southWest = google.maps.geometry.spherical.computeOffset(location as google.maps.LatLng, 40 * metersPerPixel, 240)
    const polygon = new google.maps.Polygon({
      map,
      paths: [
        { lat: northEast.lat(), lng: northEast.lng() },
        { lat: northEast.lat(), lng: southWest.lng() },
        { lat: southWest.lat(), lng: southWest.lng() },
        { lat: southWest.lat(), lng: northEast.lng() },
      ],
      ...shapeStyle,
    })

    const bounds = new google.maps.LatLngBounds()
    polygon.getPath().forEach(latlng => bounds.extend(latlng))
    onShapeCreated(polygon, GeozoneType.Polygon)
  }, [location, zoom, google, map, onShapeCreated, shapeStyle])

  return (
    <Popup open={open} marker={marker} offset={popupOffset} onClose={onClose}>
      <List disablePadding>
        <ListItem button onClick={drawPolygon}>
          <ListItemText
            primaryTypographyProps={{
              variant: 'body2',
              color: 'textPrimary',
            }}
          >
            {t('popupDrawOptions.polygonOption')}
          </ListItemText>
        </ListItem>
      </List>
      <Divider />
      <List disablePadding>
        <ListItem button onClick={drawCircle}>
          <ListItemText
            primaryTypographyProps={{
              variant: 'body2',
              color: 'textPrimary',
            }}
          >
            {t('popupDrawOptions.circleOption')}
          </ListItemText>
        </ListItem>
      </List>
    </Popup>
  )
})

export default SearchPin
