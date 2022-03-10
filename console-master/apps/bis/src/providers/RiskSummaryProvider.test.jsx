import React from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { RiskSummaryQuery } from '@ues-data/bis'

import { MockedApolloProvider, renderDataHelper } from '../../tests/utils'
import RiskSummaryProvider from './RiskSummaryProvider'

const { query, subscription } = RiskSummaryQuery

describe('RiskSummaryProvider', () => {
  const variables = { range: { last: 'LAST_YEAR' } }
  const mockQueryData = {
    riskSummary: [
      { bucket: 'aircraft', count: 1, key: 'size', value: 'small' },
      { bucket: 'automobiles', count: 8, key: 'doors', value: '2' },
      { bucket: 'bathrooms', count: 99, key: 'hasWindow', value: 'false' },
    ],
  }
  const mockSubscriptionData = {
    riskSummaryChanged: [
      { bucket: 'aircraft', count: 3, key: 'size', value: 'large' },
      { bucket: 'automobiles', count: 20, key: 'doors', value: '4' },
      { bucket: 'bathrooms', count: 407, key: 'hasWindow', value: 'true' },
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
        <RiskSummaryProvider variables={{ range: { last: 'LAST_YEAR' } }}>
          <RiskSummaryProvider.Consumer>{renderData}</RiskSummaryProvider.Consumer>
        </RiskSummaryProvider>
      </MockedApolloProvider>,
    )

    expect(onLoading).toHaveBeenCalled()
    expect(onData).not.toHaveBeenCalled()

    await act(async () => {
      jest.runOnlyPendingTimers()
      jest.runOnlyPendingTimers()
    })
    const mockSubscriptionResponse = { riskSummary: mockSubscriptionData.riskSummaryChanged }

    expect(onData).toHaveBeenLastCalledWith(mockSubscriptionResponse)

    expect(onError).not.toHaveBeenCalled()
  })
})
