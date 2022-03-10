import React from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { OperatingModeQuery } from '@ues-data/bis'

import { MockedApolloProvider } from '../../tests/utils'
import useOperatingMode from './OperatingModeProvider'

const { query, subscription } = OperatingModeQuery

const mockQueryData = { operatingMode: 'PASSIVE' }
const mockSubscriptionData = { operatingModeChanged: 'ACTIVE' }
const mocks = [
  {
    request: { query, variables: {} },
    result: { data: mockQueryData },
  },
  {
    delay: 10,
    request: { query: subscription, variables: {} },
    result: { data: mockSubscriptionData },
  },
]

const errorMocks = [
  {
    request: { query, variables: {} },
    error: new Error('test error'),
  },
  {
    delay: 10,
    request: { query: subscription, variables: {} },
    error: new Error('test error 2'),
  },
  // used to handle single re-subscribe on error
  {
    request: { query: subscription, variables: {} },
    result: { data: mockSubscriptionData },
  },
]

describe('useOperatingMode', () => {
  afterEach(cleanup)

  test('query and subscribe', async () => {
    jest.useFakeTimers()
    const Component = () => {
      const { operatingMode } = useOperatingMode()
      return <div>{operatingMode || null}</div>
    }
    const { rerender, queryByText } = render(
      <MockedApolloProvider mocks={mocks}>
        <Component />
      </MockedApolloProvider>,
    )
    expect(queryByText('ACTIVE')).toBeNull()
    expect(queryByText('PASSIVE')).toBeNull()
    await act(async () => {
      jest.advanceTimersByTime(5)
    })
    expect(queryByText('ACTIVE')).toBeNull()
    expect(queryByText('PASSIVE')).not.toBeNull()

    rerender(
      <MockedApolloProvider mocks={mocks}>
        <Component />
      </MockedApolloProvider>,
    )

    await act(async () => {
      jest.runOnlyPendingTimers()
    })

    expect(queryByText('ACTIVE')).not.toBeNull()
    expect(queryByText('PASSIVE')).toBeNull()
  })

  test('returns object on error', async () => {
    jest.useFakeTimers()
    const Component = () => {
      const { operatingMode } = useOperatingMode()
      return <div>{operatingMode || 'success'}</div>
    }
    const { queryByText } = render(
      <MockedApolloProvider mocks={errorMocks}>
        <Component />
      </MockedApolloProvider>,
    )
    await act(async () => {
      jest.runOnlyPendingTimers()
    })
    expect(queryByText('success')).not.toBeNull()
  })
})
