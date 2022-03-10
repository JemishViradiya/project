import moment from 'moment'
import React, { useContext } from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { BucketedUserEventsQuery } from '@ues-data/bis'

import { MockedApolloProvider } from '../../tests/utils'
import { testMockEvent } from './__fixtures__/eventDetails.fixture'
import BucketedUserEventsProvider from './BucketedUserEventsProvider'

const { query } = BucketedUserEventsQuery()

describe('BucketedUserEventsProvider', () => {
  const variables = {
    eEcoId: 'id3',
    range: {},
    numberOfBuckets: 14,
  }
  const mockQueryData = {
    bucketedUserEvents: {
      interval: 100000,
      buckets: [
        {
          datetime: moment().unix(),
          low: 1,
          medium: 2,
          high: 3,
          critical: 4,
          unknown: 0,
          total: 10,
          lastEventInBucket: testMockEvent,
        },
      ],
    },
  }
  const mocks = [
    {
      request: { query, variables },
      result: { data: mockQueryData },
    },
  ]

  afterEach(() => {
    cleanup()
  })

  test('can perform the initial render', async () => {
    jest.useFakeTimers()
    const onLoading = jest.fn()
    const onError = jest.fn()
    const onData = jest.fn()

    const RenderDataConsumer = () => {
      const { loading, error, data } = useContext(BucketedUserEventsProvider.Context) || {}
      if (loading) {
        onLoading && onLoading()
      } else if (error) {
        onError && onError(error)
      } else if (data) {
        onData && onData(data)
      }

      return null
    }

    render(
      <MockedApolloProvider mocks={mocks}>
        <BucketedUserEventsProvider variables={variables}>
          <RenderDataConsumer />
        </BucketedUserEventsProvider>
      </MockedApolloProvider>,
    )

    // first "loading"...
    expect(onData).not.toHaveBeenCalled()
    expect(onLoading).toHaveBeenCalled()

    await act(async () => {
      jest.runOnlyPendingTimers()
    })

    // then "data"
    expect(onData).toHaveBeenCalledTimes(1)
    expect(onLoading).toHaveBeenCalledTimes(1)

    expect(onData.mock.calls[0][0]).toMatchObject(mockQueryData)
    expect(onError).not.toHaveBeenCalled()
  })
})
