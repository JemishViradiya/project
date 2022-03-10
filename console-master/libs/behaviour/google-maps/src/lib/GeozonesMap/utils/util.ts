import type { PositionFunc } from '../../GoogleMaps'
import type {
  CircularGeozoneEntity,
  CircularGeozoneGeometry,
  GeozoneEntity,
  GeozoneShape,
  PolygonalGeozoneEntity,
  PolygonalGeozoneGeometry,
} from '../model'
import { GeozoneType, GeozoneUnit } from '../model'

// These are international miles, US survey miles are 3 mm larger.
const METRES_PER_MILE = 1609.344
const METRES_PER_KM = 1000

const metresToMiles = (metres: number) => metres / METRES_PER_MILE
const metresToKm = (metres: number) => metres / METRES_PER_KM
const milesToMetres = (miles: number) => miles * METRES_PER_MILE
const kmToMetres = (km: number) => km * METRES_PER_KM

export const convertDistanceToMetres = (distance: number, unit: GeozoneUnit) => {
  switch (unit) {
    case GeozoneUnit.km:
      return kmToMetres(distance)
    case GeozoneUnit.miles:
      return milesToMetres(distance)
  }
}

export const convertMetresToUnit = (metres, unit) => {
  switch (unit) {
    case GeozoneUnit.km:
      return metresToKm(metres)
    case GeozoneUnit.miles:
      return metresToMiles(metres)
  }
}

export const getMetersPerPixel = (lat, zoom) => {
  // See https://groups.google.com/forum/#!topic/google-maps-js-api-v3/hDRO4oHVSeM
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom)
}

export const getDegreesPerMeter = distance => {
  return (distance / (Math.PI * 6378137)) * 180
}

export const getCirclePosition = (circle: google.maps.Circle): { normal: PositionFunc; inverted: PositionFunc } => {
  const radiusInDegrees = getDegreesPerMeter(circle.getRadius())
  return {
    normal: new google.maps.LatLng(circle.getCenter().lat() + radiusInDegrees, circle.getCenter().lng()),
    inverted: new google.maps.LatLng(circle.getCenter().lat() - radiusInDegrees, circle.getCenter().lng()),
  }
}

export const getPolygonPosition = (polygon: google.maps.Polygon): { normal: PositionFunc; inverted: PositionFunc } => {
  let top = { lat: () => -90, lng: () => 0 }
  let bottom = { lat: () => 90, lng: () => 0 }
  polygon.getPath().forEach(latlng => {
    if (latlng.lat() > top.lat()) {
      top = latlng
    }
    if (latlng.lat() < bottom.lat()) {
      bottom = latlng
    }
  })
  return {
    normal: top,
    inverted: bottom,
  }
}

export const getHoveredZIndex = zIndex => zIndex + 1

export const mapShapeToGeometry = ({ shape, type }: { shape: GeozoneShape; type: GeozoneType }) => {
  if (type === GeozoneType.Circle) {
    const circle = shape as google.maps.Circle
    return {
      type: GeozoneType.Circle,
      geometry: {
        center: {
          lat: circle.getCenter().lat(),
          lng: circle.getCenter().lng(),
        },
        radius: circle.getRadius(),
      },
    } as CircularGeozoneEntity
  } else {
    const polygon = shape as google.maps.Polygon
    // Warning: This only saves the first path in the polygon.
    // If we make the polygons editable so that people can add
    // holes, this will not store the holes.
    return {
      type: GeozoneType.Polygon,
      geometry: {
        coordinates: polygon
          .getPath()
          .getArray()
          .map(latlng => ({ lat: latlng.lat(), lng: latlng.lng() })),
      },
    } as PolygonalGeozoneEntity
  }
}

// TODO: do displaying zone size and units properly as part of UES-5297, right now return only kilometres
export const getZoneSize = (geometry: CircularGeozoneGeometry | PolygonalGeozoneGeometry, type: GeozoneType, unit: GeozoneUnit) => {
  if (!geometry || unit === GeozoneUnit.miles) {
    return null
  }
  let squareMetres: number
  if (type === GeozoneType.Circle) {
    const { radius } = geometry as CircularGeozoneGeometry
    squareMetres = Math.PI * radius * radius
  } else {
    const { coordinates } = geometry as PolygonalGeozoneGeometry

    squareMetres = google.maps.geometry.spherical.computeArea(
      coordinates.map(
        coord =>
          new google.maps.LatLng({
            lat: coord.lat,
            lng: coord.lng,
          }),
      ),
    )
  }

  // TODO: i18n number format instead?
  if (squareMetres < 1000) {
    // Less than 0.1 hectare, use square metres
    return { unit: 'm²', value: squareMetres.toPrecision(4) }
  } else if (squareMetres < 10000000) {
    // Less than 1000 hectares, use hectares
    return { unit: 'ha', value: (squareMetres / 10000).toPrecision(4) }
  } else if (squareMetres) {
    // Otherwise use square kilometres
    const km = squareMetres / 1000000
    let value = km.toPrecision(4)
    if (km >= 1000000000) {
      value = `${(km / 1000000000).toPrecision(3)}G`
    } else if (km >= 1000000) {
      value = `${(km / 1000000).toPrecision(3)}M`
    } else if (km >= 1000) {
      value = `${(km / 1000).toPrecision(3)}K`
    }
    return { unit: 'km²', value }
  }
  return null
}
