import React, { createContext, useContext } from 'react'

import { gql, InMemoryCache } from '@apollo/client'
import { act, render } from '@testing-library/react'

import { MockedApolloProvider } from '../../tests/utils'
import { loadMoreFieldPolicy } from '../common/apollo'
import ListProvider from './ListProvider'

describe('ListProvider', () => {
  // TODO: unskip this test if MockedProvider fixes this: https://spectrum.chat/apollo/apollo-client/mockedprovider-doesnt-provide-data-unless-fetchpolicy-no-cache~6d63a968-787a-48cb-89cd-877cdafb229d
  // which makes it impossible to correctly test 'merge' functionality as 'no-cache' doesn't use cache
  test.skip('useLoadMoreRows pagination', async () => {
    jest.useFakeTimers()

    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies: {
        Query: {
          fields: {
            testQuery: loadMoreFieldPolicy('testTable'),
          },
        },
      },
    })

    const createTestTableResult = count =>
      Array(count)
        .fill()
        .map((_, index) => ({ id: index + 1 }))

    const TestQuery = {
      query: gql`
        query testQuery($size: Int, $offset: Int) {
          testQuery(size: $size, offset: $offset) {
            total
            testTable {
              id
            }
          }
        }
      `,
    }
    const { query } = TestQuery

    const total = 181
    const initialQuery = {
      request: { query, variables: { offset: 0, size: 25 } },
      result: {
        data: {
          total,
          testTable: createTestTableResult(25),
        },
        loading: false,
        error: false,
      },
    }
    const mocks = [
      initialQuery,
      initialQuery,
      {
        request: { query, variables: { offset: 25, size: 100 } },
        result: {
          data: {
            total,
            testTable: createTestTableResult(100),
          },
        },
      },
      {
        request: { query, variables: { offset: 125, size: 50 } },
        result: {
          data: {
            total,
            testTable: createTestTableResult(50),
          },
        },
      },
      {
        request: { query, variables: { offset: 175, size: 50 } },
        result: {
          data: {
            total,
            testTable: createTestTableResult(6),
          },
        },
      },
    ]

    const ListContext = createContext([])
    const { Provider } = ListContext

    const loaderOptions = { key: 'testQuery', dataKey: 'testTable' }

    const initialVariables = {
      offset: 0,
      size: 25,
    }

    let loadMoreRows
    const ListComponent = () => {
      const { total, data, loadMoreRows: loadMoreRowsMethod } = useContext(ListContext)
      loadMoreRows = loadMoreRowsMethod
      return (
        <>
          <span>{`Total ${total || 0}`}</span>
          <span>{`Currently loaded ${data?.length || 0}`}</span>
          <span>{`Last loaded item ID ${data?.[data.length - 1]?.id}`}</span>
        </>
      )
    }

    const { queryByText } = render(
      <MockedApolloProvider mocks={mocks} cache={cache}>
        <ListProvider query={TestQuery} provider={Provider} variables={initialVariables} loaderOptions={loaderOptions}>
          <ListComponent />
        </ListProvider>
      </MockedApolloProvider>,
    )
    expect(queryByText('Total 0')).not.toBeNull()
    expect(queryByText('Currently loaded 0')).not.toBeNull()
    expect(queryByText('Last loaded item ID undefined')).not.toBeNull()
    await act(async () => {
      jest.runOnlyPendingTimers()
      jest.runOnlyPendingTimers()
    })
    expect(queryByText(`Total ${total}`)).not.toBeNull()
    expect(queryByText('Currently loaded 25')).not.toBeNull()
    expect(queryByText('Last loaded item ID 25')).not.toBeNull()
    await act(async () => {
      loadMoreRows({ startIndex: 25, stopIndex: 101 })
      jest.runOnlyPendingTimers()
    })
    expect(queryByText(`Total ${total}`)).not.toBeNull()
    expect(queryByText('Currently loaded 175')).not.toBeNull()
    expect(queryByText('Last loaded item ID 175')).not.toBeNull()
    await act(async () => {
      loadMoreRows({ startIndex: 125, stopIndex: 174 })
      jest.runOnlyPendingTimers()
    })
    expect(queryByText(`Total ${total}`)).not.toBeNull()
    expect(queryByText('Currently loaded 125')).not.toBeNull()
    expect(queryByText('Last loaded item ID 125')).not.toBeNull()
    await act(async () => {
      loadMoreRows({ startIndex: 175, stopIndex: 180 })
      jest.runOnlyPendingTimers()
    })
    expect(queryByText(`Total ${total}`)).not.toBeNull()
    expect(queryByText('Currently loaded 181')).not.toBeNull()
    expect(queryByText('Last loaded item ID 181')).not.toBeNull()
  })
})
