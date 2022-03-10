import moment from 'moment'
import React from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { LatestEventsQuery } from '@ues-data/bis'

import { MockedApolloProvider, renderDataHelper } from '../../tests/utils'
import LatestEventsProvider from './LatestEventsProvider'

const { query, subscription } = LatestEventsQuery

jest.mock('../components/hooks/useTenant', () => () => 't1')

describe('LatestEventsProvider', () => {
  const variables = {}
  const mockQueryData = {
    latestEvents: [{ datetime: moment().unix(), low: 1, medium: 2, high: 3, critical: 4, total: 10 }],
  }
  const mockSubscriptionData = {
    latestEventsChanged: [{ datetime: moment().unix(), low: 4, medium: 3, high: 2, critical: 2, total: 11 }],
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
        <LatestEventsProvider>
          <LatestEventsProvider.Context.Consumer>{renderData}</LatestEventsProvider.Context.Consumer>
        </LatestEventsProvider>
      </MockedApolloProvider>,
    )

    expect(onLoading).toHaveBeenCalled()
    expect(onData).not.toHaveBeenCalled()

    await act(async () => {
      jest.runOnlyPendingTimers()
      jest.runOnlyPendingTimers()
    })

    const mockSubscriptionResponse = { latestEvents: mockSubscriptionData.latestEventsChanged }

    expect(onData).toHaveBeenLastCalledWith(mockSubscriptionResponse)

    expect(onError).not.toHaveBeenCalled()
  })
})
