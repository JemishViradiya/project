import PropTypes from 'prop-types'
import React, { createContext, useMemo } from 'react'

import { LocalGroupsQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

import { common } from '../shared'

export const Context = createContext([])
const { Provider, Consumer } = Context

const sorter = common.arraySort('name', 'ASC')

const LocalGroupsProvider = ({ children }) => {
  const isDirectoryLinked = false
  const queryVariables = { isDirectoryLinked }
  const { loading, error, data } = useStatefulApolloQuery(LocalGroupsQuery, { variables: queryVariables })
  const sortedData = useMemo(() => (data && data.localGroups ? { localGroups: [...data.localGroups].sort(sorter) } : {}), [data])
  const value = useMemo(() => ({ loading, error, data: sortedData }), [error, sortedData, loading])
  return <Provider value={value}>{children}</Provider>
}

LocalGroupsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

LocalGroupsProvider.Consumer = Consumer

export default LocalGroupsProvider
