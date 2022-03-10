import { Bounds, getBoundsZoomLevel } from './util'

describe('Bounds class based on LatLngBounds', () => {
  expect.extend({
    toMatchLatLng(received, lat, lng) {
      if (!received || !received.lat || !received.lng) {
        return {
          message: () => `expected ${received} to be a LatLng`,
          pass: false,
        }
      }

      const rlat = received.lat()
      const rlng = received.lng()
      if (rlat === lat && rlng === lng) {
        return {
          message: () => `expected (${rlat}, ${rlng}) not to be (${lat}, ${lng})`,
          pass: true,
        }
      } else {
        return {
          message: () => `expected (${rlat}, ${rlng}) to be (${lat}, ${lng})`,
          pass: false,
        }
      }
    },
  })

  it('can normalize longitude', () => {
    const bounds = new Bounds()
    expect(bounds.normalizeLng(-180)).toEqual(-180)
    expect(bounds.normalizeLng(-179)).toEqual(-179)
    expect(bounds.normalizeLng(-1)).toEqual(-1)
    expect(bounds.normalizeLng(0)).toEqual(0)
    expect(bounds.normalizeLng(1)).toEqual(1)
    expect(bounds.normalizeLng(179)).toEqual(179)
    expect(bounds.normalizeLng(180)).toEqual(-180)
    expect(bounds.normalizeLng(181)).toEqual(-179)
    expect(bounds.normalizeLng(360)).toEqual(0)
    expect(bounds.normalizeLng(539)).toEqual(179)
    expect(bounds.normalizeLng(540)).toEqual(-180)
    expect(bounds.normalizeLng(541)).toEqual(-179)
    expect(bounds.normalizeLng(-360)).toEqual(0)
    expect(bounds.normalizeLng(-539)).toEqual(-179)
    expect(bounds.normalizeLng(-540)).toEqual(-180)
    expect(bounds.normalizeLng(-541)).toEqual(179)
  })

  it('can handle no points', () => {
    const bounds = new Bounds()
    expect(bounds.getCenter()).toMatchLatLng(0, 0)
    expect(bounds.getNorthEast()).toMatchLatLng(0, 0)
    expect(bounds.getSouthWest()).toMatchLatLng(0, 0)
    expect(getBoundsZoomLevel(bounds, { width: 256, height: 256 })).toEqual(21)
  })

  it('can handle one point near the north pole', () => {
    const point = [89, -179]
    const bounds = new Bounds()
    bounds.extend({ lat: point[0], lng: point[1] })
    expect(bounds.getCenter()).toMatchLatLng(point[0], point[1])
    expect(bounds.getNorthEast()).toMatchLatLng(point[0], point[1])
    expect(bounds.getSouthWest()).toMatchLatLng(point[0], point[1])
    expect(getBoundsZoomLevel(bounds, { width: 320, height: 320 })).toEqual(21)
  })

  it('can handle one point near the equator', () => {
    const point = [-1, 178]
    const bounds = new Bounds()
    bounds.extend({ lat: point[0], lng: point[1] })
    expect(bounds.getCenter()).toMatchLatLng(point[0], point[1])
    expect(bounds.getNorthEast()).toMatchLatLng(point[0], point[1])
    expect(bounds.getSouthWest()).toMatchLatLng(point[0], point[1])
    expect(getBoundsZoomLevel(bounds, { width: 160, height: 160 })).toEqual(21)
  })

  it('can handle one point near the south pole', () => {
    const point = [-88, 1]
    const bounds = new Bounds()
    bounds.extend({ lat: point[0], lng: point[1] })
    expect(bounds.getCenter()).toMatchLatLng(point[0], point[1])
    expect(bounds.getNorthEast()).toMatchLatLng(point[0], point[1])
    expect(bounds.getSouthWest()).toMatchLatLng(point[0], point[1])
    expect(getBoundsZoomLevel(bounds, { width: 256, height: 256 })).toEqual(21)
  })

  it('can handle two normal points', () => {
    // Both points very close in lng, across the equator in lat
    const points = [
      [-36, 18],
      [24, 12],
    ]
    const center = [-6, 15]
    const bounds = new Bounds()
    bounds.extend({ lat: points[0][0], lng: points[0][1] })
    bounds.extend({ lat: points[1][0], lng: points[1][1] })
    expect(bounds.getCenter()).toMatchLatLng(center[0], center[1])
    // Point 0 is the southeast corner, Point 1 is the northwest corner
    // but we need northeast and southwest, so switch the coords.
    expect(bounds.getNorthEast()).toMatchLatLng(points[1][0], points[0][1])
    expect(bounds.getSouthWest()).toMatchLatLng(points[0][0], points[1][1])
    expect(getBoundsZoomLevel(bounds, { width: 256, height: 256 })).toEqual(2)
    expect(getBoundsZoomLevel(bounds, { width: 512, height: 512 })).toEqual(3)
  })

  it('can handle two points in the pacific starting on the east', () => {
    // Point 0 is near the south pole on the eastern edge
    // Point 1 is further north on the western edge
    const points = [
      [-86, 176],
      [-68, -168],
    ]
    // The center should be on the western side
    const center = [-77, -176]
    const bounds = new Bounds()
    bounds.extend({ lat: points[0][0], lng: points[0][1] })
    bounds.extend({ lat: points[1][0], lng: points[1][1] })
    expect(bounds.getCenter()).toMatchLatLng(center[0], center[1])
    // The northeast corner is point 1
    expect(bounds.getNorthEast()).toMatchLatLng(points[1][0], points[1][1])
    // The southwest corner is point 0
    expect(bounds.getSouthWest()).toMatchLatLng(points[0][0], points[0][1])
    expect(getBoundsZoomLevel(bounds, { width: 512, height: 512 })).toEqual(3)
  })

  it('can handle two points in the pacific starting on the west', () => {
    // Point 0 is near the north pole on the western edge
    // Point 1 is in the southern hemisphere near the eastern edge
    const points = [
      [86, -176],
      [-34, 168],
    ]
    // The center is a bit into the northern hemisphere, and should be on the eastern
    // edge of the map.
    const center = [26, 176]
    const bounds = new Bounds()
    bounds.extend({ lat: points[0][0], lng: points[0][1] })
    bounds.extend({ lat: points[1][0], lng: points[1][1] })
    expect(bounds.getCenter()).toMatchLatLng(center[0], center[1])
    // The northeast corner is point 0
    expect(bounds.getNorthEast()).toMatchLatLng(points[0][0], points[0][1])
    // The southwest corner is point 1
    expect(bounds.getSouthWest()).toMatchLatLng(points[1][0], points[1][1])
    expect(getBoundsZoomLevel(bounds, { width: 512, height: 512 })).toEqual(1)
  })

  it('can handle a multitude of points on the equator', () => {
    // The points are intentionally provided unsorted, but the sorted order is
    // [-153, -96, -68, -24, 13, 18, 24, 84, 127, 160, 175]
    // The gaps are:
    // [57, 28, 44, 37, 5, 6, 60, 43, 33, 15, 32]
    // So the biggest gap is between 24 and 84. This means we should get bounds something like
    // (longitude only) [-276, 24] or [84, 384], depending on normalization.
    // The center should be halfway between, at [0, -126] or [0, 234]
    // The northeast point should be at [0, 24] or [0, 384]
    // The southwest point should be at [0, -276] or [0, 84]
    const points = [13, 18, 24, -153, -68, -24, 175, 84, 127, -96, 160].map(lng => [0, lng])
    // The center is a bit into the northern hemisphere, and should be on the eastern
    // edge of the map.
    const center = [0, -126]
    const bounds = new Bounds()
    points.forEach(point => {
      bounds.extend({ lat: point[0], lng: point[1] })
    })
    expect(bounds.getCenter()).toMatchLatLng(center[0], center[1])
    expect(bounds.getNorthEast()).toMatchLatLng(0, 24)
    expect(bounds.getSouthWest()).toMatchLatLng(0, 84)
    expect(getBoundsZoomLevel(bounds, { width: 512, height: 512 })).toEqual(1)
  })

  it('can handle two points on either side of globe', () => {
    // Exact opposites means that we could pick either bounding box
    // In this case we happen to pick the 'western' choice, so we get
    // longitude bounds from -260 to -80, centered at -170.
    const points = [
      [-60, -80],
      [60, 100],
    ]
    const center = [0, -170]
    const bounds = new Bounds()
    bounds.extend({ lat: points[0][0], lng: points[0][1] })
    bounds.extend({ lat: points[1][0], lng: points[1][1] })
    expect(bounds.getCenter()).toMatchLatLng(center[0], center[1])
    // Point 0 is the southeast corner, Point 1 is the northwest corner
    // but we need northeast and southwest, so switch the coords.
    expect(bounds.getNorthEast()).toMatchLatLng(points[1][0], points[0][1])
    expect(bounds.getSouthWest()).toMatchLatLng(points[0][0], points[1][1])
    expect(getBoundsZoomLevel(bounds, { width: 512, height: 512 })).toEqual(2)

    // Now add a third point that switches our choice
    const newCenter = [0, 10]
    bounds.extend({ lat: 0, lng: -70 })
    expect(bounds.getCenter()).toMatchLatLng(newCenter[0], newCenter[1])
    // Point 0 is now the southwest corner, and Point 1 is the northeast corner
    expect(bounds.getNorthEast()).toMatchLatLng(points[1][0], points[1][1])
    expect(bounds.getSouthWest()).toMatchLatLng(points[0][0], points[0][1])
    expect(getBoundsZoomLevel(bounds, { width: 512, height: 512 })).toEqual(2)
  })

  it('can handle multiple points with same longitude', () => {
    const points = [
      [-60, 0],
      [60, 0],
    ]
    const center = [0, 0]
    const bounds = new Bounds()
    bounds.extend({ lat: points[0][0], lng: points[0][1] })
    bounds.extend({ lat: points[1][0], lng: points[1][1] })
    expect(bounds.getCenter()).toMatchLatLng(center[0], center[1])
    // Point 0 is the southeast corner, Point 1 is the northwest corner
    // but we need northeast and southwest, so switch the coords.
    expect(bounds.getNorthEast()).toMatchLatLng(points[1][0], points[0][1])
    expect(bounds.getSouthWest()).toMatchLatLng(points[0][0], points[1][1])
    expect(getBoundsZoomLevel(bounds, { width: 512, height: 512 })).toEqual(2)
  })

  it('can handle multiple points with same non-zero longitude', () => {
    const points = [
      [-60, 150],
      [80, 150],
    ]
    const center = [10, 150]
    const bounds = new Bounds()
    bounds.extend({ lat: points[0][0], lng: points[0][1] })
    bounds.extend({ lat: points[1][0], lng: points[1][1] })
    expect(bounds.getCenter()).toMatchLatLng(center[0], center[1])
    // Point 0 is the southeast corner, Point 1 is the northwest corner
    // but we need northeast and southwest, so switch the coords.
    expect(bounds.getNorthEast()).toMatchLatLng(points[1][0], points[0][1])
    expect(bounds.getSouthWest()).toMatchLatLng(points[0][0], points[1][1])
    expect(getBoundsZoomLevel(bounds, { width: 512, height: 512 })).toEqual(1)
  })

  it('can handle multiple points with same negative non-zero longitude', () => {
    const points = [
      [-80, -150],
      [20, -150],
    ]
    const center = [-30, -150]
    const bounds = new Bounds()
    bounds.extend({ lat: points[0][0], lng: points[0][1] })
    bounds.extend({ lat: points[1][0], lng: points[1][1] })
    expect(bounds.getCenter()).toMatchLatLng(center[0], center[1])
    // Point 0 is the southeast corner, Point 1 is the northwest corner
    // but we need northeast and southwest, so switch the coords.
    expect(bounds.getNorthEast()).toMatchLatLng(points[1][0], points[0][1])
    expect(bounds.getSouthWest()).toMatchLatLng(points[0][0], points[1][1])
    expect(getBoundsZoomLevel(bounds, { width: 512, height: 512 })).toEqual(2)
  })
})
