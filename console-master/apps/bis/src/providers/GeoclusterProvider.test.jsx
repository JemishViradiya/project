import React from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { GeoclusterQuery } from '@ues-data/bis'

import { MockedApolloProvider, renderDataHelper } from '../../tests/utils'
import { GeoclusterProvider } from './GeoclusterProvider'

const { query, subscription } = GeoclusterQuery

describe('GeoclusterProvider', () => {
  const variables = { range: { last: 'LAST_YEAR' } }
  const mockQueryData = {
    geoClusters: {
      count: 1,
      data: [
        {
          lat: 50,
          lon: 49,
          geohash: 'v0',
          bounds: { top_left: { lat: 25, lon: 26 }, bottom_right: { lat: 88, lon: 99 } },
          count: 67,
          critical: 17,
          high: 21,
          medium: 10,
          low: 3,
        },
      ],
    },
  }
  const mockSubscriptionData = {
    geoClustersChanged: {
      count: 2,
      data: [
        {
          lat: 49,
          lon: 50,
          geohash: 'v0',
          bounds: { top_left: { lat: 26, lon: 25 }, bottom_right: { lat: 98, lon: 89 } },
          count: 76,
          critical: 51,
          high: 9,
          medium: 12,
          low: 8,
        },
        {
          lat: 9,
          lon: 10,
          geohash: 's1',
          bounds: { top_left: { lat: 7, lon: 8 }, bottom_right: { lat: 12, lon: 13 } },
          count: 70,
          critical: 50,
          high: 3,
          medium: 12,
          low: 8,
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
        <GeoclusterProvider variables={{ range: { last: 'LAST_YEAR' } }}>
          <GeoclusterProvider.Consumer>{renderData}</GeoclusterProvider.Consumer>
        </GeoclusterProvider>
      </MockedApolloProvider>,
    )

    expect(onLoading).toHaveBeenCalled()
    expect(onData).not.toHaveBeenCalled()

    await act(async () => {
      jest.runOnlyPendingTimers()
      jest.runOnlyPendingTimers()
    })

    const mockSubscriptionResponse = { geoClusters: mockSubscriptionData.geoClustersChanged }

    expect(onData).toHaveBeenLastCalledWith(mockSubscriptionResponse)

    expect(onError).not.toHaveBeenCalled()
  })
})
