import Geohash from 'latlon-geohash'

export const encode = (lat, lon, precision = 5) => Geohash.encode(lat, lon, precision)

export const decode = geohash => Geohash.decode(geohash)

export const getBounds = geohash => {
  const bounds = Geohash.bounds(geohash)

  return {
    north: bounds.ne.lat,
    south: bounds.sw.lat,
    east: bounds.ne.lon,
    west: bounds.sw.lon,
  }
}
