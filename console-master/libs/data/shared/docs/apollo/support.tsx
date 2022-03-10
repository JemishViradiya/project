/* eslint-disable sonarjs/no-identical-functions */
import React, { useEffect, useState } from 'react'

import { MockedProvider } from '@apollo/client/testing'

import { MoreData } from '../MoreData'
import { PageData } from '../PageData'
import { getMoreData, getPageData, timeFormatter } from '../util'
import { mutateDog, queryDog } from './dog'
import { listDogsByPage, listDogsProgressively } from './dogs'

const delay = 300
const getMoreQuery = (limit: number, offset: number) => {
  return {
    query: listDogsProgressively.query,
    variables: {
      limit: limit,
      offset: offset,
    },
  }
}

const getMoreResult = (limit: number, offset: number, quiet = process.env.NODE_CONFIG_ENV === 'test') => {
  const data = getMoreData(limit, offset)
  if (!quiet)
    console.log(
      'queryMoreData',
      `limit: ${data.pageInfo.limit}, offset: ${data.pageInfo.offset}, hasMore: ${data.pageInfo.hasMore}`,
      data,
    )
  return { data }
}

const getPageQuery = (limit: number, page: number) => {
  return {
    query: listDogsByPage.query,
    variables: {
      limit: limit,
      page: page,
    },
  }
}
const getPageResult = (limit: number, page: number, quiet = process.env.NODE_CONFIG_ENV === 'test') => {
  const data = getPageData(limit, page)
  if (!quiet)
    console.log(
      'queryPageData',
      `limit: ${data.pageInfo.limit}, page: ${data.pageInfo.page}, prev: ${data.pageInfo.prev}, next: ${data.pageInfo.next}`,
      data,
    )
  return { data }
}

const createMockMoreQueries = (trials: number, limit: number, start: number) => {
  const queries = []
  let query = null

  for (let t = 0; t < trials; t++) {
    let offset = 0
    for (let i = 0; i < 20 / limit; i++) {
      offset = limit * i
      query = {
        delay,
        request: getMoreQuery(limit, offset + start),
        result: getMoreResult(limit, offset + start, true),
      }
      queries.push(query)
    }
    queries.push({
      delay,
      request: getMoreQuery(limit, -1),
      error: new Error('Invalid Request'),
    })
  }
  return queries
}

const createMockPageQueries = (trials: number, limit: number, start: number) => {
  const queries = []
  let query = null

  for (let t = 0; t < trials; t++) {
    for (let i = 0; i < 20 / limit; i++) {
      query = {
        delay,
        request: getPageQuery(limit, i + start),
        result: getPageResult(limit, i + start, true),
      }
      queries.push(query)
    }
    queries.push({
      delay,
      request: getPageQuery(limit, -1),
      error: new Error('Invalid Request'),
    })
  }
  return queries
}

const mocks = [
  {
    delay,
    request: {
      query: queryDog.query,
      variables: {
        name: 'Buck',
      },
    },
    result: () => {
      const data = {
        dog: { id: '1', name: 'Buck', breed: 'bulldog' },
      }
      if (process.env.NODE_ENV !== 'test') console.log('query', { name: 'Buck' }, data)
      return { data }
    },
  },
  {
    delay,
    request: {
      query: queryDog.query,
      variables: { name: 'Dud' },
    },
    error: Object.assign(new Error('aw shucks'), {
      name: 'Dud',
      statusCode: 404,
    }),
  },
  {
    delay,
    request: {
      query: mutateDog.mutation,
      variables: { name: 'Buck' },
    },
    result: () => {
      const data = {
        dog: { id: '1', name: 'Buck', breed: 'bulldog' },
      }
      if (process.env.NODE_ENV !== 'test') console.log('query', { name: 'Buck' }, data)
      return { data }
    },
  },
  {
    delay,
    request: {
      query: mutateDog.mutation,
      variables: { name: 'Dud' },
    },
    error: Object.assign(new Error('aw shucks'), {
      name: 'Dud',
      statusCode: 404,
    }),
  },
]

// Create multiple mock query sets to allow mulitple apollo identical testing queries
// without error: "Uncaught (in promise) Error: No more mocked responses for the query"
const trials = 5
export const MORE_QUERY_LIMIT = 3

const fetchMoreMocks = [].concat(...[1, 2, 3, 4, 5, 8, 10].map(limit => createMockMoreQueries(trials, limit, 0)))
const fetchPageMocks = [].concat(...[1, 2, 3, 4, 5, 8, 10].map(limit => createMockPageQueries(trials, limit, 1)))
const allMocks = [].concat(mocks, mocks, mocks, fetchMoreMocks, fetchPageMocks)

export const apolloDecorator = Story => (
  <MockedProvider mocks={allMocks} addTypename={false}>
    <Story />
  </MockedProvider>
)

export const UesDecorator = ({ children = null, ...props }) => (
  <MockedProvider mocks={allMocks} addTypename={false}>
    {React.cloneElement(children, props)}
  </MockedProvider>
)

export const MoreApolloData = ({ data, fetchMore, ...props }) => {
  const [content, setContent] = useState(null)
  useEffect(() => {
    if (data?.data?.length === data?.pageInfo?.offset) {
      setContent(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.pageInfo?.offset])

  const update = async vars => {
    const { offset, limit } = vars
    const result = await fetchMore(vars)
    setContent(state => {
      if (state.data.length > offset) {
        result.data = state.data.slice().splice(offset, limit, ...result.data)
      } else {
        result.data = [...state.data, ...result.data]
      }
      return result
    })
    return result
  }
  return <MoreData {...content} fetchMore={update} {...props} />
}

export const PagedApolloData = ({ data, fetchMore, ...props }) => {
  const [content, setContent] = useState(data)
  const update = async vars => {
    const result = await fetchMore(vars)
    setContent(result)
  }
  useEffect(() => {
    if (data && !content) {
      setContent(data)
    }
  }, [content, data])
  return <PageData {...content} fetchMore={update} {...props} />
}
