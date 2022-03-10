import PropTypes from 'prop-types'
import React, { createContext, useMemo, useRef } from 'react'

import { PolicyListQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

import { common } from '../shared'

export const Context = createContext([])
const { Provider, Consumer } = Context

const PolicyListProvider = ({ variables, children }) => {
  const cache = useRef([])
  const { sortBy, sortDirection, searchText } = variables || {}

  const { loading, error, data = {} } = useStatefulApolloQuery(PolicyListQuery, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    partialRefetch: true,
  })

  cache.current = useMemo(() => (data.policies && data.policies.map((policy, index) => ({ ...policy, rank: index + 1 }))) || [], [
    data.policies,
  ])

  const policies = cache.current
  const filteredData = useMemo(() => {
    let filtered = [...policies]
    if (searchText && searchText.length >= 1) {
      filtered = filtered.filter(policy => policy.name.toLowerCase().includes(searchText.toLowerCase()))
    }
    filtered = filtered.sort(common.arraySort(sortBy, sortDirection))
    return filtered
  }, [policies, searchText, sortBy, sortDirection])

  const value = useMemo(() => ({ loading, error, data: filteredData, total: filteredData.length }), [error, filteredData, loading])
  return <Provider value={value}>{children}</Provider>
}

PolicyListProvider.propTypes = {
  variables: PropTypes.shape({
    sortBy: PropTypes.string.isRequired,
    sortDirection: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
    searchText: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
}

PolicyListProvider.defaultProps = {
  variables: {
    sortBy: 'name',
    sortDirection: 'ASC',
  },
}

PolicyListProvider.Consumer = Consumer

export default PolicyListProvider
