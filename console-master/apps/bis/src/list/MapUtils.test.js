import { isInBounds, markerBounds } from './MapUtils'

const checkBounds = (a, b) => {
  const { top_left: atl, bottom_right: abr } = a
  const { top_left: btl, bottom_right: bbr } = b
  expect(atl.lat).toBeCloseTo(btl.lat, 6)
  expect(atl.lon).toBeCloseTo(btl.lon, 6)
  expect(abr.lat).toBeCloseTo(bbr.lat, 6)
  expect(abr.lon).toBeCloseTo(bbr.lon, 6)
}

describe('MapUtils: markerBounds', () => {
  test('regular bounds', () => {
    const bounds = { top_left: { lat: 12.5, lon: 80 }, bottom_right: { lat: -8.8, lon: 120 } }
    const answer = { top_left: { lat: 23.15, lon: 60 }, bottom_right: { lat: -19.45, lon: 140 } }
    const newBounds = markerBounds(bounds)
    checkBounds(newBounds, answer)
  })

  test('regular bounds: bottom right across 180 after adding the padding', () => {
    const bounds = { top_left: { lat: 12.5, lon: 100 }, bottom_right: { lat: -8.8, lon: 170 } }
    const answer = { top_left: { lat: 23.15, lon: 65 }, bottom_right: { lat: -19.45, lon: -155 } }
    const newBounds = markerBounds(bounds)
    checkBounds(newBounds, answer)
  })

  test('regular bounds: top left across -180 after adding the padding', () => {
    const bounds = { top_left: { lat: 12.5, lon: -160 }, bottom_right: { lat: -8.8, lon: 10 } }
    const answer = { top_left: { lat: 23.15, lon: 115 }, bottom_right: { lat: -19.45, lon: 95 } }
    const newBounds = markerBounds(bounds)
    checkBounds(newBounds, answer)
  })

  test('full longitude range', () => {
    const bounds = { top_left: { lat: 12.5, lon: -180 }, bottom_right: { lat: -8.8, lon: 180 } }
    const answer = { top_left: { lat: 23.15, lon: -180 }, bottom_right: { lat: -19.45, lon: 180 } }
    const newBounds = markerBounds(bounds)
    checkBounds(newBounds, answer)
  })

  test('bounds across -180 degree', () => {
    const bounds = { top_left: { lat: 12.5, lon: 160 }, bottom_right: { lat: -8.8, lon: -110 } }
    const answer = { top_left: { lat: 23.15, lon: 115 }, bottom_right: { lat: -19.45, lon: -65 } }
    const newBounds = markerBounds(bounds)
    checkBounds(newBounds, answer)
  })

  test('bounds across -180 degree: become full ranged after adding the padding', () => {
    const bounds = { top_left: { lat: 12.5, lon: 160 }, bottom_right: { lat: -8.8, lon: 100 } }
    const answer = { top_left: { lat: 23.15, lon: -180 }, bottom_right: { lat: -19.45, lon: 180 } }
    const newBounds = markerBounds(bounds)
    checkBounds(newBounds, answer)
  })

  test('latitude over 90 degree', () => {
    const bounds = { top_left: { lat: 80, lon: 100.5 }, bottom_right: { lat: -10, lon: 170.7 } }
    const answer = { top_left: { lat: 90, lon: 65.4 }, bottom_right: { lat: -55, lon: -154.2 } }
    const newBounds = markerBounds(bounds)
    checkBounds(newBounds, answer)
  })

  test('latitude over -90 degree', () => {
    const bounds = { top_left: { lat: 80, lon: 100.5 }, bottom_right: { lat: -70, lon: 170.7 } }
    const answer = { top_left: { lat: 90, lon: 65.4 }, bottom_right: { lat: -90, lon: -154.2 } }
    const newBounds = markerBounds(bounds)
    checkBounds(newBounds, answer)
  })
})

describe('MapUtils: isInBounds', () => {
  test('regular bounds', () => {
    const bounds = { top_left: { lat: 80, lon: 100.5 }, bottom_right: { lat: -70, lon: 150.7 } }
    let location = { lat: 50, lon: 120.4 }
    expect(isInBounds(bounds, location)).toBe(true)
    location = { lat: 50, lon: 160.4 }
    expect(isInBounds(bounds, location)).toBe(false)
    location = { lat: -75, lon: 120.4 }
    expect(isInBounds(bounds, location)).toBe(false)
  })

  test('bounds across -180 degree', () => {
    const bounds = { top_left: { lat: 80, lon: 140.5 }, bottom_right: { lat: -70, lon: -110 } }
    let location = { lat: 50, lon: 150.4 }
    expect(isInBounds(bounds, location)).toBe(true)
    location = { lat: 50, lon: 150.4 }
    expect(isInBounds(bounds, location)).toBe(true)
    location = { lat: 50, lon: -130.4 }
    expect(isInBounds(bounds, location)).toBe(true)
    location = { lat: 50, lon: -180 }
    expect(isInBounds(bounds, location)).toBe(true)
    location = { lat: 50, lon: 180 }
    expect(isInBounds(bounds, location)).toBe(true)
    location = { lat: 50, lon: 120.4 }
    expect(isInBounds(bounds, location)).toBe(false)
    location = { lat: 50, lon: -8 }
    expect(isInBounds(bounds, location)).toBe(false)
    location = { lat: 50, lon: 0 }
    expect(isInBounds(bounds, location)).toBe(false)
  })
})
