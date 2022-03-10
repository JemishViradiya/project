import React from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { GeozoneRiskLineQuery } from '@ues-data/bis'

import { MockedApolloProvider, renderDataHelper } from '../../tests/utils'
import GeozoneRiskLineProvider from './GeozoneRiskLineProvider'

const { query, subscription } = GeozoneRiskLineQuery

describe('GeozoneRiskLineProvider', () => {
  const variables = { range: { last: 'LAST_YEAR' } }
  const mockQueryData = {
    geozoneRiskLine: [
      {
        bucket: 'world series',
        data: [
          { time: 0, count: 0 },
          { time: 1, count: 1 },
          { time: 2, count: 2 },
        ],
      },
      {
        bucket: 'time series',
        data: [
          { time: 0, count: 10 },
          { time: 1, count: 11 },
          { time: 2, count: 12 },
        ],
      },
      {
        bucket: 'formal power series',
        data: [
          { time: 0, count: 20 },
          { time: 1, count: 21 },
          { time: 2, count: 22 },
        ],
      },
    ],
  }
  const mockSubscriptionData = {
    geozoneRiskLineChanged: [
      {
        bucket: 'world series',
        data: [
          { time: 3, count: 0 },
          { time: 4, count: 1 },
          { time: 5, count: 2 },
        ],
      },
      {
        bucket: 'time series',
        data: [
          { time: 3, count: 10 },
          { time: 4, count: 11 },
          { time: 5, count: 12 },
        ],
      },
      {
        bucket: 'formal power series',
        data: [
          { time: 3, count: 20 },
          { time: 4, count: 21 },
          { time: 5, count: 22 },
        ],
      },
    ],
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
        <GeozoneRiskLineProvider variables={{ range: { last: 'LAST_YEAR' } }}>
          <GeozoneRiskLineProvider.Consumer>{renderData}</GeozoneRiskLineProvider.Consumer>
        </GeozoneRiskLineProvider>
      </MockedApolloProvider>,
    )

    expect(onLoading).toHaveBeenCalled()
    expect(onData).not.toHaveBeenCalled()

    await act(async () => {
      jest.runOnlyPendingTimers()
      jest.runOnlyPendingTimers()
    })

    const mockSubscriptionResponse = { geozoneRiskLine: mockSubscriptionData.geozoneRiskLineChanged }

    expect(onData).toHaveBeenLastCalledWith(mockSubscriptionResponse)

    expect(onError).not.toHaveBeenCalled()
  })
})
