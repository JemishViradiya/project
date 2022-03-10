import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'

import { useStatefulApolloQuery } from '@ues-data/shared'

import useLoadMoreRows from '../components/hooks/useLoadMoreRows'

const MemoProvider = memo(({ provider, value: valueProp, loaderOptions, children }) => {
  const { error, data, total, refetch, variables: { sortBy, sortDirection } = {}, loading } = valueProp
  const loadMoreRows = useLoadMoreRows(valueProp, loaderOptions)
  const value = useMemo(
    () => ({
      error,
      data,
      total,
      refetch,
      variables: { sortBy, sortDirection },
      loadMoreRows,
      loading,
    }),
    [error, data, total, refetch, loadMoreRows, sortBy, sortDirection, loading],
  )
  return React.createElement(provider, { value, children })
})

const ListProvider = ({ provider, query, variables, loaderOptions, children }) => {
  const { error, data, refetch, fetchMore, loading } = useStatefulApolloQuery(query, {
    variables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
    partialRefetch: true,
  })

  const listData = (data && data[loaderOptions.key]) || {}
  const value = {
    error,
    data: listData[loaderOptions.dataKey],
    total: listData.total,
    variables,
    refetch,
    fetchMore,
    loading,
  }
  return (
    <MemoProvider value={value} provider={provider} loaderOptions={loaderOptions}>
      {children}
    </MemoProvider>
  )
}

ListProvider.propTypes = {
  provider: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  variables: PropTypes.object.isRequired,
  loaderOptions: PropTypes.shape({
    key: PropTypes.string.isRequired,
    dataKey: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
}

export default ListProvider
