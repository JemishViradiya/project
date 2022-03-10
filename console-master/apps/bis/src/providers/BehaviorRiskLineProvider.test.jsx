import React from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { BehavioralRiskLineQuery } from '@ues-data/bis'

import { MockedApolloProvider, renderDataHelper } from '../../tests/utils'
import BehaviorRiskLineProvider from './BehaviorRiskLineProvider'

const { query, subscription } = BehavioralRiskLineQuery

describe('BehaviorRiskLineProvider', () => {
  const mockQueryData = {
    behaviorRiskLine: [
      {
        bucket: 'GOOD',
        data: [
          { time: 1, count: 1 },
          { time: 2, count: 2 },
        ],
      },
      {
        bucket: 'BAD',
        data: [
          { time: 1, count: 10 },
          { time: 2, count: 20 },
        ],
      },
      {
        bucket: 'UGLY',
        data: [
          { time: 1, count: 30 },
          { time: 2, count: 60 },
        ],
      },
    ],
  }
  const mockSubscriptionData = {
    behaviorRiskLineChanged: [
      {
        bucket: 'GOOD',
        data: [
          { time: 1, count: 3 },
          { time: 2, count: 4 },
        ],
      },
      {
        bucket: 'BAD',
        data: [
          { time: 1, count: 30 },
          { time: 2, count: 40 },
        ],
      },
      {
        bucket: 'UGLY',
        data: [
          { time: 1, count: 50 },
          { time: 2, count: 90 },
        ],
      },
    ],
  }
  const initialMock = {
    request: {
      query,
      variables: { range: { last: 'LAST_YEAR' } },
    },
    result: { data: mockQueryData },
  }
  const mocks = [
    initialMock,
    initialMock,
    {
      delay: 30,
      request: {
        query: subscription,
        variables: { range: { last: 'LAST_YEAR' } },
      },
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
        <BehaviorRiskLineProvider variables={{ range: { last: 'LAST_YEAR' } }}>
          <BehaviorRiskLineProvider.Consumer>{renderData}</BehaviorRiskLineProvider.Consumer>
        </BehaviorRiskLineProvider>
      </MockedApolloProvider>,
    )

    expect(onLoading).toHaveBeenCalled()
    expect(onData).not.toHaveBeenCalled()

    await act(async () => {
      jest.runOnlyPendingTimers()
      jest.runOnlyPendingTimers()
    })

    const mockSubscriptionResponse = { behaviorRiskLine: mockSubscriptionData.behaviorRiskLineChanged }

    expect(onData).toHaveBeenLastCalledWith(mockSubscriptionResponse)

    expect(onError).not.toHaveBeenCalled()
  })
})
