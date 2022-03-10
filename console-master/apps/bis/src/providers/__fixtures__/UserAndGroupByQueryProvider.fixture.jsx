import React, { useContext } from 'react'

import { UserAndGroupByQuery } from '@ues-data/bis'

import { Context } from '../UserAndGroupByQueryProvider'

export const ContextConsumer = () => {
  const { data, loading, error } = useContext(Context)
  const total = !data ? 0 : data.reduce(acc => (acc = acc + 1), 0)
  return (
    <>
      <div>{loading && 'loading'}</div>
      <div>{error && 'error'}</div>
      <div>{data && 'data'}</div>
      <div>{total && `total: ${total}`}</div>
    </>
  )
}

export const REQUEST = {
  query: UserAndGroupByQuery.query,
  fetchPolicy: 'cache-and-network',
  nextFetchPolicy: 'cache-first',
  skip: false,
  variables: {
    query: 'searchText',
  },
}

export const EMPTY_DATA = { directoryByName: { users: [], groups: [] } }

export const TEST_DATA = {
  directoryByName: {
    users: [
      {
        id: 'TEST_ID',
        info: {
          displayName: 'TEST_NAME',
          primaryEmail: 'TEST_EMAIL',
          username: 'TEST_USERNAME',
        },
        __typename: 'TEST_USER_TYPE',
      },
    ],
    groups: [
      {
        id: 'TEST_ID',
        info: {
          name: '7yy8y',
          description: 'huiui',
        },
        __typename: 'TEST_GROUP_TYPE',
      },
    ],
  },
}
