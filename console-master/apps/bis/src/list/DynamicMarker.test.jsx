import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, render } from '@testing-library/react'

import Markers from './DynamicMarker'

jest.mock('../components/map/ClusterMapMarker', () => ({ children, ...props }) => (
  <div data-testid="ClusterMapMarker">{JSON.stringify(props)}</div>
))
jest.mock('../components/map/UserMapMarker', () => ({ children, ...props }) => (
  <div data-testid="UserMapMarker">{JSON.stringify(props)}</div>
))
jest.mock('../components/map/EventMapMarker', () => ({ children, ...props }) => (
  <div data-testid="EventMapMarker">{JSON.stringify(props)}</div>
))

describe('Markers', () => {
  afterEach(cleanup)

  test('renders both clusters and user markers', async () => {
    // mocks for stuff that's required by children
    const zoomMock = jest.fn()
    const bounds = {
      top_left: { lat: 0, lon: 1 },
      bottom_right: { lat: 10, lon: 11 },
    }

    const lat = 50
    const lon = 51
    const critical = 5
    const high = 3
    const clusters = [
      {
        geohash: 'user hash 1',
        count: 1,
        user: { assessment: { behaviouralRiskLevel: 'high', location: { lat: 12.345, lon: 12.345 } } },
        bounds,
        lat,
        lon,
      },
      {
        geohash: 'user hash 2',
        count: 1,
        user: { assessment: { behaviouralRiskLevel: 'low', location: { lat: 12.345, lon: 12.345 } } },
        bounds,
        lat,
        lon,
      },
      { geohash: 'cluster hash 2', count: 2, bounds, lat, lon, critical, high },
      { geohash: 'cluster hash 3', count: 3, bounds, lat, lon, critical, high },
      { geohash: 'cluster hash 4', count: 4, bounds, lat, lon, critical, high },
      { geohash: 'event hash 1', count: 1, bounds, lat, lon, representative: { id: 'mockEventId', riskLevel: 'Medium' } },
    ]

    const wrapper = render(<Markers clusters={clusters} zoomToBounds={zoomMock} />)
    expect(wrapper).not.toBeNull()

    // high-order-components monkey with the names of children...

    // the user markers
    const userMapMarkers = wrapper.getAllByTestId('UserMapMarker')
    expect(userMapMarkers).toHaveLength(2)

    // the cluster markers
    const clusterMapMarkers = wrapper.getAllByTestId('ClusterMapMarker')
    expect(clusterMapMarkers).toHaveLength(3)

    // the event markers
    const eventMarkers = wrapper.getAllByTestId('EventMapMarker')
    expect(eventMarkers).toHaveLength(1)

    // also, check that the callback does something...
    const eventMarker = eventMarkers[0]
    expect(eventMarker).toBeTruthy()
  })
})
