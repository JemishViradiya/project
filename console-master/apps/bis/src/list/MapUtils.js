import { environment } from '../environments/environment'
import { Bounds, getBoundsZoomLevel, getViewport, getZoomLevelBounds } from '../googleMaps/util'

const mapConfig = environment.map
const MAX_AUTO_ZOOM = (mapConfig && mapConfig.zoom && mapConfig.zoom.maxAutoZoom) || 18
const BOUNDS_PADDING_RATIO = (mapConfig && mapConfig.zoom && mapConfig.zoom.boundsPadding) || 0.5

export const markerBounds = ({ top_left: tl, bottom_right: br }) => {
  // There are 3 cases of returned longitudes from Google map bounds.
  // 1) full range: tl.lon == -180 && br.lon == 180
  // 2) across -180 degree: tl.lon > br.lon
  // 3) other cases: tl.lon <= br.lon
  const dlat = (tl.lat - br.lat) * BOUNDS_PADDING_RATIO
  let dlon = 0
  let fullRange = tl.lon === -180 && br.lon === 180
  if (!fullRange) {
    let range = br.lon - tl.lon
    if (range < 0) {
      range += 360
    }
    dlon = range * BOUNDS_PADDING_RATIO
    if (range + 2 * dlon >= 360) {
      fullRange = true
    }
  }

  const b = {
    top_left: {
      lat: Math.min(tl.lat + dlat, 90),
      lon: fullRange ? -180 : tl.lon - dlon,
    },
    bottom_right: {
      lat: Math.max(br.lat - dlat, -90),
      lon: fullRange ? 180 : br.lon + dlon,
    },
  }
  if (!fullRange) {
    if (b.top_left.lon < -180) {
      b.top_left.lon += 360
    }
    if (b.bottom_right.lon > 180) {
      b.bottom_right.lon -= 360
    }
  }
  return b
}

export const isEqualBounds = (a, b) => {
  if (!a || !b) return a === b
  else if (a === b) return true

  const { top_left: atl, bottom_right: abr } = a
  const { top_left: btl, bottom_right: bbr } = b
  return atl.lat === btl.lat && atl.lon === btl.lon && abr.lat === bbr.lat && abr.lon === bbr.lon
}

const roundLocation = location => ({
  lat: Number(location.lat.toFixed(6)),
  lon: Number(location.lon.toFixed(6)),
})

export const isInBounds = (bounds, location) => {
  let { top_left: tl, bottom_right: br } = bounds || {}
  if (!tl || !br || !location) return false
  // Sometimes, the cluster bounds returned by elasticsearch has certain deviation.
  // For example, if we have two events at the same location {
  //   "lat": 43.516836915210426,
  //   "lon": -80.51238618581196
  // }
  // The geo bounds returned for this cluster was {
  //   "top_left": {
  //     "lat": 43.51683690212667,
  //     "lon": -80.51238625310361
  //   },
  //   "bottom_right": {
  //     "lat": 43.51683690212667,
  //     "lon": -80.51238625310361
  //   }
  //
  // So we round up the location numbers to 6 digits after the decimal point.
  // That introduces about 14cm deviation from the actual location.
  location = roundLocation(location)
  tl = roundLocation(tl)
  br = roundLocation(br)
  if (tl.lon < br.lon) {
    return tl.lat >= location.lat && tl.lon <= location.lon && br.lat <= location.lat && br.lon >= location.lon
  } else {
    // The bounds across -180 degree.
    if (location.lon >= 0) {
      return tl.lat >= location.lat && br.lat <= location.lat && tl.lon <= location.lon
    } else {
      return tl.lat >= location.lat && br.lat <= location.lat && br.lon >= location.lon
    }
  }
}

export const autoZoomAdjuster = (clusters, map, width, height, maxZoom = MAX_AUTO_ZOOM) => {
  if (clusters.length > 0) {
    // TODO: handle constrained bounds that cannot see all the points by not moving
    const zoomBounds = new Bounds()
    clusters.forEach(({ bounds }) => {
      zoomBounds.extend({ lat: bounds.top_left.lat, lng: bounds.top_left.lon })
      zoomBounds.extend({ lat: bounds.bottom_right.lat, lng: bounds.bottom_right.lon })
    })
    const newViewport = { ...getViewport(map) }
    const c = zoomBounds.getCenter()
    newViewport.center = { lat: c.lat(), lng: c.lng(), latLng: c }

    // Padding width and height to ensure map markers fully displayed on zoomed map.
    const paddedWidth = width
    const paddedHeight = height || width
    const boundsZoom = getBoundsZoomLevel(zoomBounds, { width: paddedWidth, height: paddedHeight })
    if (boundsZoom > maxZoom) {
      const b = getZoomLevelBounds(maxZoom, newViewport.center, { width: paddedWidth, height: paddedHeight })
      Object.assign(zoomBounds, b)
    }
    newViewport.zoom = Math.min(maxZoom, boundsZoom)
    newViewport.bounds = zoomBounds
    return newViewport
  }
}
