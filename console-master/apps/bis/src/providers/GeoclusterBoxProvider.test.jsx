import React from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { GeoclusterBoxQuery } from '@ues-data/bis'

import { MockedApolloProvider, renderDataHelper } from '../../tests/utils'
import { GeoclusterBoxProvider } from './GeoclusterProvider'

const { query, subscription } = GeoclusterBoxQuery

describe('GeoclusterBoxProvider', () => {
  const variables = {
    range: { last: 'LAST_YEAR' },
    zoomLevel: 1,
  }
  const mockQueryData = {
    geoClustersBox: {
      count: 1,
      data: [
        {
          geohash: '1st crazy geohash string',
          lat: 5,
          lon: 6,
          bounds: {
            top_left: { lat: 1, lon: 2, geohash: '2nd crazy geohash string' },
            bottom_right: { lat: 8, lon: 9, geohash: '3rd crazy geohash string' },
          },
          count: 25,
          critical: 13,
          high: 7,
          representative: { id: '1st guy', riskScore: 11.0, assessment: JSON.stringify({ some: 'thing', or: null, another: 1 }) },
        },
      ],
    },
  }
  const mockSubscriptionData = {
    geoClustersChangedBox: {
      count: 2,
      data: [
        {
          geohash: '4th crazy geohash string',
          lat: 59,
          lon: 60,
          bounds: {
            top_left: { lat: 1, lon: 2, geohash: '5th crazy geohash string' },
            bottom_right: { lat: 70, lon: 109, geohash: '6th crazy geohash string' },
          },
          count: 25,
          critical: 13,
          high: 7,
          representative: { id: '4th guy', riskScore: 41.0, assessment: JSON.stringify({ some: 'thing', or: null, another: 2 }) },
        },
        {
          geohash: '7th crazy geohash string',
          lat: 125, // it actually doesn't matter if these are consistent geolocations...
          lon: 126,
          bounds: {
            top_left: { lat: 110, lon: 2, geohash: '8th crazy geohash string' },
            bottom_right: { lat: 8, lon: 9, geohash: '9th crazy geohash string' },
          },
          count: 29,
          critical: 10,
          high: 6,
          representative: { id: '7th guy', riskScore: 71.0, assessment: JSON.stringify({ some: 'thing', or: null, another: 3 }) },
        },
      ],
    },
  }
  const initialMock = {
    request: { query, variables },
    result: { data: mockQueryData },
  }
  const mocks = [
    initialMock,
    initialMock,
    {
      delay: 30,
      request: { query: subscription, variables },
      result: { data: mockSubscriptionData },
    },
  ]

  afterEach(cleanup)

  test('can perform the initial render', async () => {
    jest.useFakeTimers()

    const onLoading = jest.fn()
    const onError = jest.fn()
    const onData = jest.fn()

    const renderData = renderDataHelper(onLoading, onError, onData)

    render(
      <MockedApolloProvider mocks={mocks}>
        <GeoclusterBoxProvider variables={{ range: { last: 'LAST_YEAR' } }}>
          <GeoclusterBoxProvider.Consumer>{renderData}</GeoclusterBoxProvider.Consumer>
        </GeoclusterBoxProvider>
      </MockedApolloProvider>,
    )

    expect(onLoading).toHaveBeenCalled()
    expect(onData).not.toHaveBeenCalled()

    await act(async () => {
      jest.runOnlyPendingTimers()
      jest.runOnlyPendingTimers()
    })

    const mockSubscriptionResponse = { geoClustersBox: mockSubscriptionData.geoClustersChangedBox }

    expect(onData).toHaveBeenLastCalledWith(mockSubscriptionResponse)

    expect(onError).not.toHaveBeenCalled()
  })
})
