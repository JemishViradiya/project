import Geohash from 'latlon-geohash'

import mergeClusters from './mergeClusters'

expect.extend({
  toBeCloseTo(actual, expected, precision = 2) {
    const precisionPower = Math.pow(10, -precision)
    const pass = Math.abs(expected - actual) < precisionPower / 2

    if (!pass) {
      return {
        message: () => `expected ${actual} to be within ${precisionPower} of ${expected}`,
        pass: false,
      }
    }

    return {
      message: () => `expected ${actual} not to be within ${precisionPower} of ${expected}`,
      pass: true,
    }
  },
})

const makeDatapoint = ({ point, geohash, count, critical = count, high = 0, medium = 0, low = 0 }) => {
  const { lat, lon } = point || Geohash.decode(geohash)
  const { sw, ne } = Geohash.bounds(geohash)
  return {
    lat,
    lon,
    geohash,
    count,
    critical,
    high,
    medium,
    low,
    bounds: {
      top_left: {
        lat: ne.lat,
        lon: sw.lon,
      },
      bottom_right: {
        lat: sw.lat,
        lon: ne.lon,
      },
    },
  }
}

describe('mergeClusters', () => {
  test('simple cases with no merging', () => {
    expect(mergeClusters([], 2)).toEqual([])
    const data = [makeDatapoint({ geohash: 'gc', count: 1 })]
    expect(mergeClusters(data, 2)).toEqual(data)
    data.push(makeDatapoint({ geohash: 'eb', count: 2, critical: 0, low: 2 }))
    let merged = mergeClusters(data, 2)
    expect(data.length).toBe(merged.length)
    for (const item of data) {
      expect(merged).toContainEqual(item)
    }
    data.push(makeDatapoint({ geohash: 'sb', count: 4, critical: 2, high: 4, medium: 5, low: 3 }))
    merged = mergeClusters(data, 2)
    expect(data.length).toBe(merged.length)
    for (const item of data) {
      expect(merged).toContainEqual(item)
    }
  })

  test('simple merging', () => {
    // gc is adjacent and to the west of u1, across the lon=0 line.
    const gc = Geohash.decode('gc')

    const data = [
      makeDatapoint({ point: { lat: gc.lat, lon: -0.01 }, geohash: 'gc', count: 2, critical: 1, low: 1 }),
      makeDatapoint({ point: { lat: gc.lat, lon: 0.01 }, geohash: 'u1', count: 2, critical: 1, medium: 1 }),
    ]
    const result = mergeClusters(data, 2)
    expect(result).toHaveLength(1)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          lat: expect.toBeCloseTo(gc.lat, 4),
          lon: 0,
          geohash: expect.stringMatching(/(gc|u1)/),
          count: 4,
          critical: 2,
          high: 0,
          medium: 1,
          low: 1,
        }),
      ]),
    )
  })

  test('more simple merging', () => {
    // gc is adjacent and to the north of gb
    const gc = Geohash.decode('gc')
    const gb = Geohash.decode('gb')
    const middleLat = (gc.lat + gb.lat) / 2

    const data = [
      makeDatapoint({
        point: { lat: middleLat + 0.1, lon: gc.lon + 0.1 },
        geohash: 'gc',
        count: 4,
        critical: 1,
        high: 1,
        medium: 1,
        low: 1,
      }),
      makeDatapoint({ point: { lat: middleLat - 0.1, lon: gc.lon }, geohash: 'gb', count: 4, critical: 2, high: 2 }),
    ]
    const result = mergeClusters(data, 2)
    expect(result).toHaveLength(1)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          lat: expect.toBeCloseTo(middleLat, 2),
          lon: expect.toBeCloseTo(gc.lon + 0.05, 2),
          geohash: expect.stringMatching(/(gc|gb)/),
          count: 8,
          critical: 3,
          high: 3,
          medium: 1,
          low: 1,
        }),
      ]),
    )
  })

  test('three-way merging', () => {
    // gc is adjacent and to the north of gb
    // u1 is east of gc
    const gc = Geohash.decode('gc')
    const u1 = Geohash.decode('u1')
    const gb = Geohash.decode('gb')
    const middleLat = (gc.lat + gb.lat) / 2
    const middleLon = (gc.lon + u1.lon) / 2

    const data = [
      makeDatapoint({
        point: { lat: middleLat, lon: middleLon + 0.2 },
        geohash: 'u1',
        count: 4,
        critical: 1,
        high: 1,
        medium: 1,
        low: 1,
      }),
      makeDatapoint({ point: { lat: middleLat - 0.1, lon: middleLon - 0.1 }, geohash: 'gb', count: 4, critical: 2, high: 2 }),
      makeDatapoint({ point: { lat: middleLat + 0.1, lon: middleLon - 0.1 }, geohash: 'gc', count: 4, critical: 2, high: 2 }),
    ]
    const result = mergeClusters(data, 2)
    expect(result).toHaveLength(1)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          lat: expect.toBeCloseTo(middleLat, 2),
          lon: expect.toBeCloseTo(middleLon, 4),
          geohash: expect.stringMatching(/(gc|gb|u1)/),
          count: 12,
          critical: 5,
          high: 5,
          medium: 1,
          low: 1,
        }),
      ]),
    )
  })

  test('sis-3314', () => {
    const data = [
      {
        geohash: 'u1',
        lat: 50.97625386246757,
        lon: 4.515034263148098,
        bounds: {
          top_left: { lat: 52.09139296319336, lon: 4.4420249573886395 },
          bottom_right: { lat: 50.84071699529886, lon: 5.105687538161874 },
        },
        count: 37,
        critical: 37,
        high: 0,
        medium: 0,
        low: 0,
      },
      {
        geohash: 'gc',
        lat: 51.74963845172897,
        lon: -1.007574019022286,
        bounds: {
          top_left: { lat: 51.764243971556425, lon: -1.0603765491396189 },
          bottom_right: { lat: 51.51082597207278, lon: -0.11900701560080051 },
        },
        count: 36,
        critical: 27,
        high: 0,
        medium: 5,
        low: 4,
      },
      {
        geohash: 'u0',
        lat: 45.664800303056836,
        lon: 8.823985569179058,
        bounds: {
          top_left: { lat: 45.664893966168165, lon: 8.823818983510137 },
          bottom_right: { lat: 45.6647029845044, lon: 8.824111931025982 },
        },
        count: 9,
        critical: 9,
        high: 0,
        medium: 0,
        low: 0,
      },
      {
        geohash: 'u2',
        lat: 48.14716439760689,
        lon: 16.79190949935998,
        bounds: {
          top_left: { lat: 48.147273967042565, lon: 16.791825955733657 },
          bottom_right: { lat: 48.147075986489654, lon: 16.791991917416453 },
        },
        count: 7,
        critical: 0,
        high: 0,
        medium: 4,
        low: 3,
      },
    ]
    const result = mergeClusters(data, 2)
    expect(result).toHaveLength(1)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          lat: expect.toBeCloseTo(50.5, 0),
          lon: expect.toBeCloseTo(3.68, 0),
          geohash: expect.stringMatching(/(gc|u1|u0|u2)/),
          count: 89,
          critical: 73,
          high: 0,
          medium: 9,
          low: 7,
        }),
      ]),
    )
  })

  test('merge across date line', () => {
    // These geohash regions are neighbours across the date line
    const pairs = [
      { east: 'zy', west: 'bn' },
      { east: 'zv', west: 'bj' },
      { east: 'zu', west: 'bh' },
      { east: 'zg', west: 'b5' },
      { east: 'zf', west: 'b4' },
      { east: 'zc', west: 'b1' },
    ]
    let data = []
    for (const { east, west } of pairs) {
      const eastHash = Geohash.decode(east)
      const westHash = Geohash.decode(west)
      data = [
        makeDatapoint({
          point: { lat: eastHash.lat, lon: 179.5 },
          geohash: east,
          count: 1,
        }),
        makeDatapoint({
          point: { lat: westHash.lat, lon: -179.5 },
          geohash: west,
          count: 1,
        }),
      ]
      const result = mergeClusters(data, 2)
      expect(result).toHaveLength(1)
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            lat: expect.toBeCloseTo(eastHash.lat, 2),
            lon: expect.toBeCloseTo(180, 2),
            geohash: expect.any(String),
            count: 2,
            critical: 2,
            high: 0,
            medium: 0,
            low: 0,
          }),
        ]),
      )
    }
  })
})
