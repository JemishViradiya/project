import type { Position } from '../GoogleMaps'

export type GeozoneShape = google.maps.Circle | google.maps.Polygon

export enum GeozoneType {
  Circle = 'circle',
  Polygon = 'polygon',
}

export enum GeozonePopupMode {
  Add = 'add',
  Edit = 'edit',
}

export enum GeozoneUnit {
  km = 'km',
  miles = 'miles',
}

interface Geozone<TType extends GeozoneType, TGeometry, TMetadata = any> {
  id: string | number
  type: TType | `${TType}`
  geometry: TGeometry
  metadata: TMetadata
  unit: GeozoneUnit
  name: string
}

export interface CircularGeozoneGeometry {
  center: Position
  radius: number
}

export interface PolygonalGeozoneGeometry {
  coordinates: Position[]
}

export type CircularGeozoneEntity<TMetadata = any> = Geozone<GeozoneType.Circle, CircularGeozoneGeometry, TMetadata>

export type PolygonalGeozoneEntity<TMetadata = any> = Geozone<GeozoneType.Polygon, PolygonalGeozoneGeometry, TMetadata>

export type GeozoneEntity<TMetadata = any> = CircularGeozoneEntity<TMetadata> | PolygonalGeozoneEntity<TMetadata>

export interface ShapeStyleOptions {
  fillColor: string
  fillOpacity: number
  strokeColor: string
  strokeWeight: number
}

export interface CircularGeozoneOptions extends CircularGeozoneGeometry, ShapeStyleOptions {
  clickable?: boolean
}

export interface PolygonalGeozoneOptions extends ShapeStyleOptions {
  paths: Position[]
  clickable?: boolean
}

export type ShapeGeozoneOptions = CircularGeozoneOptions | PolygonalGeozoneOptions

class LatLng {
  lat: () => number
  lng: () => number

  constructor(lat, lng) {
    this.lat = () => lat
    this.lng = () => lng
    this.toString = () => `(${lat}, ${lng})`
  }
}

export class Bounds {
  north: number
  south: number
  east: number
  west: number
  lngs: number[]
  sorted: boolean

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
