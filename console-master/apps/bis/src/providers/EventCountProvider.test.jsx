import React from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { EventCountQuery } from '@ues-data/bis'

import { MockedApolloProvider, renderDataHelper } from '../../tests/utils'
import EventCountProvider from './EventCountProvider'

describe('EventCountProvider', () => {
  const { query, subscription } = EventCountQuery

  const mockQueryData = { eventCount: 117 }
  const mockSubscriptionData = { eventCountChanged: 202 }
  const initialMock = {
    request: { query, variables: { range: { last: 'LAST_YEAR' } } },
    result: { data: mockQueryData },
  }
  const mocks = [
    initialMock,
    initialMock,
    {
      delay: 30,
      request: { query: subscription, variables: { range: { last: 'LAST_YEAR' } } },
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
        <EventCountProvider variables={{ range: { last: 'LAST_YEAR' } }}>
          <EventCountProvider.Consumer>{renderData}</EventCountProvider.Consumer>
        </EventCountProvider>
      </MockedApolloProvider>,
    )

    expect(onLoading).toHaveBeenCalled()
    expect(onData).not.toHaveBeenCalled()

    await act(async () => {
      jest.runOnlyPendingTimers()
      jest.runOnlyPendingTimers()
    })

    const mockSubscriptionResponse = { eventCount: mockSubscriptionData.eventCountChanged }

    expect(onData).toHaveBeenLastCalledWith(mockSubscriptionResponse)

    expect(onError).not.toHaveBeenCalled()
  })
})
