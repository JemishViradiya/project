import { environment } from '../environments/environment'

const mapConfig = environment.map
const MAX_AUTO_ZOOM = (mapConfig && mapConfig.zoom && mapConfig.zoom.maxAutoZoom) || 18

// how to get the zoom level needed to render given bounds, from
// https://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds
//
// bounds: a google.maps.LatLngBounds object
// mapDim: { height, width } of the DOM element containing the map.
//   - reduce them if you want padding
const WORLD_DIM = { height: 256, width: 256 }
const toZoom = (mapPx, worldPx, fraction, clamp) => clamp(Math.log(mapPx / worldPx / fraction) / Math.LN2)
const toFraction = (mapPx, worldPx, zoom) => mapPx / worldPx / Math.exp(zoom * Math.LN2)

const latRad = lat => {
  const sin = Math.sin((lat * Math.PI) / 180)
  const radX2 = Math.log((1 + sin) / (1 - sin)) / 2
  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2
}
const latRad1 = latF => {
  const lRadX2 = Math.exp(latF * 4)
  const sin = (lRadX2 - 1) / (lRadX2 + 1)
  return (Math.asin(sin) * 180) / Math.PI
}

export const getBoundsZoomLevel = (bounds, mapDim, clamp = Math.floor) => {
  const ZOOM_MAX = 21
  const ne = bounds.getNorthEast()
  const sw = bounds.getSouthWest()

  const latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI

  const lngDiff = ne.lng() - sw.lng()
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360

  const latZoom = toZoom(mapDim.height, WORLD_DIM.height, latFraction, clamp)
  const lngZoom = toZoom(mapDim.width, WORLD_DIM.width, lngFraction, clamp)

  return Math.min(latZoom, lngZoom, ZOOM_MAX)
}

export const getZoomLevelBounds = (zoomLevel, center, mapDim) => {
  const latFrac = toFraction(mapDim.height, WORLD_DIM.height, zoomLevel)
  const lngDiff = toFraction(mapDim.width, WORLD_DIM.width, zoomLevel) / 360
  const latDiff = latRad1(latFrac * Math.PI)

  return {
    north: center.lat + latDiff / 2,
    east: center.lng + lngDiff / 2,
    south: center.lat - latDiff / 2,
    west: center.lng - lngDiff / 2,
  }
}

export const getMetersPerPixel = (lat, zoom) => {
  // See https://groups.google.com/forum/#!topic/google-maps-js-api-v3/hDRO4oHVSeM
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom)
}

export const getDegreesPerMeter = distance => {
  return (distance / (Math.PI * 6378137)) * 180
}

// the composition of the getMetersPerPixel and getDegreesPerMeter
// collapsing all the constants as much as possible
export const getDegreesPerPixel = (lat, zoom) => {
  return (1.40625 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom)
}

export const getCircleTopBottom = circle => {
  const radiusInDegrees = getDegreesPerMeter(circle.getRadius())
  return [
    {
      lat: () => circle.getCenter().lat() + radiusInDegrees,
      lng: () => circle.getCenter().lng(),
    },
    {
      lat: () => circle.getCenter().lat() - radiusInDegrees,
      lng: () => circle.getCenter().lng(),
    },
  ]
}

export const getPolygonTopBottom = polygon => {
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
  return [top, bottom]
}

export const getPrecision = (maxPrecision, mapZoom) => {
  return Math.max(1, Math.min(maxPrecision, Math.ceil((mapZoom + 3) / 3)))
}

class LatLng {
  constructor(lat, lng) {
    this.lat = () => lat
    this.lng = () => lng
    this.toString = () => `(${lat}, ${lng})`
  }
}

export class Bounds {
  constructor() {
    this.north = 0
    this.south = 0
    this.east = 0
    this.west = 0
    this.lngs = []
  }

  extend({ lat, lng }) {
    this.sorted = false
    if (typeof lat === 'function') {
      lat = lat()
    }
    if (typeof lng === 'function') {
      lng = lng()
    }
    if (this.lngs.length === 0) {
      this.north = lat
      this.south = lat
      this.east = lng
      this.west = lng
      this.lngs = [lng]
      return
    }

    if (lat > this.north) {
      this.north = lat
    }
    if (lat < this.south) {
      this.south = lat
    }
    this.lngs.push(lng)
  }

  doBounds() {
    if (this.sorted) return
    this.sorted = true

    if (this.lngs.length < 2) {
      this.east = this.lngs[0] || 0
      this.west = this.lngs[0] || 0
      return
    }

    const lngs = this.lngs.sort((a, b) => a - b)
    let largestDifference = 0
    let leftIndex = 0
    lngs.forEach((lng, i) => {
      let nextLng = lngs[i + 1]
      if (nextLng !== 0 && !nextLng) {
        // If we have no more points, then take the first point on the other side of the world.
        nextLng = lngs[0] + 360
      }
      const diff = nextLng - lng
      if (diff > largestDifference) {
        largestDifference = diff
        leftIndex = i
      }
    })
    this.east = lngs[leftIndex]
    this.west = lngs[leftIndex + 1] - 360 || lngs[0]
  }

  normalizeLng(lng) {
    let answer = lng
    while (answer >= 180) {
      answer -= 360
    }
    while (answer < -180) {
      answer += 360
    }
    return answer
  }

  getCenter() {
    this.doBounds()
    const lat = 0.5 * (this.north + this.south)
    const lng = this.normalizeLng(0.5 * (this.east + this.west))
    return new LatLng(lat, lng)
  }

  getNorthEast() {
    this.doBounds()
    const lng = this.normalizeLng(this.east)
    return new LatLng(this.north, lng)
  }

  getSouthWest() {
    this.doBounds()
    const lng = this.normalizeLng(this.west)
    return new LatLng(this.south, lng)
  }

  // WARNING: The values here are not really all that accurate
  // and are really only used as estimates of how large the region
  // will be displayed on screen.
  getWidthMeters() {
    this.doBounds()
    // Width along a latitude line varies with the latitude
    // We will measure along the midpoint latitude line of our box
    const lat = 0.5 * (this.north + this.south)
    const metersPerDegree = 111319.4908 * Math.cos((Math.PI * lat) / 180)
    return (this.east - this.west) * metersPerDegree
  }

  getHeightMeters() {
    this.doBounds()
    // Height along a longitude line is constant for all longitudes
    // This magic value is the number of meters for one degree
    // assuming that the Earth is a uniform sphere of radius 6378137
    return 111319.4908 * (this.north - this.south)
  }
}

export const getViewport = map => {
  const zoom = map.getZoom()
  const center = map.getCenter()
  const lat = center.lat()
  const lng = center.lng()

  return {
    center: { lat, lng },
    zoom,
  }
}

export const centerBoundsAdjuster = (map, center, width, height, maxZoom = MAX_AUTO_ZOOM) => {
  if (center) {
    const zoomBounds = new Bounds()
    zoomBounds.extend(center)
    const newViewport = { ...getViewport(map) }

    const c = zoomBounds.getCenter()
    newViewport.center = { lat: c.lat(), lng: c.lng(), latLng: c }

    // Padding width and height to ensure map markers fully displayed on zoomed map.
    const paddedWidth = width
    const paddedHeight = height || width
    const b = getZoomLevelBounds(maxZoom, newViewport.center, { width: paddedWidth, height: paddedHeight })
    Object.assign(zoomBounds, b)

    newViewport.bounds = zoomBounds
    return newViewport
  }
}
