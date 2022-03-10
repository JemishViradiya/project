import React from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { UserCountQuery } from '@ues-data/bis'

import { MockedApolloProvider, renderDataHelper } from '../../tests/utils'
import UserCountProvider from './UserCountProvider'

const { query, subscription } = UserCountQuery

describe('UserCountProvider', () => {
  const variables = { range: { last: 'LAST_YEAR' } }
  const mockQueryData = { userCount: 1 }
  const mockSubscriptionData = { userCountChanged: 20043 }
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
        <UserCountProvider variables={{ range: { last: 'LAST_YEAR' } }}>
          <UserCountProvider.Consumer>{renderData}</UserCountProvider.Consumer>
        </UserCountProvider>
      </MockedApolloProvider>,
    )

    expect(onLoading).toHaveBeenCalled()
    expect(onData).not.toHaveBeenCalled()

    await act(async () => {
      jest.runOnlyPendingTimers()
      jest.runOnlyPendingTimers()
    })

    const mockSubscriptionResponse = { userCount: mockSubscriptionData.userCountChanged }

    expect(onData).toHaveBeenLastCalledWith(mockSubscriptionResponse)

    expect(onError).not.toHaveBeenCalled()
  })
})
