import PropTypes from 'prop-types'
import React, { createContext, useMemo } from 'react'

import { UserAndGroupByQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

const EMPTY_ARRAY = []

export const Context = createContext([])
const { Provider, Consumer } = Context

const fallback = { users: [], groups: [] }
export const UserAndGroupByQueryProvider = ({ searchText, children }) => {
  const { loading, error, data = {} } = useStatefulApolloQuery(UserAndGroupByQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { query: searchText },
    skip: !searchText,
  })

  const directoryByName = data.directoryByName || fallback
  const items = useMemo(() => {
    return [].concat(directoryByName.users, directoryByName.groups)
  }, [directoryByName.groups, directoryByName.users])

  const value = useMemo(() => ({ loading, error, data: error ? EMPTY_ARRAY : items }), [loading, error, items])

  return <Provider value={value}>{children}</Provider>
}

UserAndGroupByQueryProvider.propTypes = {
  searchText: PropTypes.string,
  children: PropTypes.node.isRequired,
}

UserAndGroupByQueryProvider.Consumer = Consumer

export default UserAndGroupByQueryProvider
