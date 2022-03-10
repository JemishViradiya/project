import PropTypes from 'prop-types'
import React, { createContext, useContext, useRef } from 'react'

import { GeozoneListQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

import { RiskLevel } from '../components/RiskLevel'
import { common } from '../shared'

export const getSortedGeozones = (geozones, filter = []) => {
  // Sort by name first.
  const sorted = geozones.filter(({ id }) => !filter.find(zone => zone.geozoneId === id)).sort(common.arraySort('name', 'ASC'))

  // Put to level buckets.
  const high = []
  const medium = []
  const low = []
  sorted.forEach(zone => {
    switch (zone.risk) {
      case RiskLevel.HIGH:
        high.push(zone)
        break
      case RiskLevel.MEDIUM:
        medium.push(zone)
        break
      case RiskLevel.LOW:
        low.push(zone)
        break
    }
  })
  return [...high, ...medium, ...low]
}

export const Context = createContext([])
const { Provider, Consumer } = Context

export const useGeozoneListContext = () => useContext(Context)

const GeozoneListProvider = ({ variables, children }) => {
  const cache = useRef([])
  const { sortBy, sortDirection, searchText } = variables || {}

  const { loading, error, data } = useStatefulApolloQuery(GeozoneListQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    partialRefetch: true,
  })

  if (!loading && !error && data.geozones) {
    // Create a new geozones array to trigger children rendering.
    cache.current = [...data.geozones].sort(common.arraySort(sortBy, sortDirection)).slice(0)
  }

  let filteredData = cache.current
  if (searchText && searchText.length >= 3) {
    filteredData = cache.current.filter(zone => zone.name.toLowerCase().includes(searchText.toLowerCase()))
  }
  const total = filteredData.length
  return <Provider value={{ loading, error, data: filteredData, total }}>{children}</Provider>
}

GeozoneListProvider.propTypes = {
  variables: PropTypes.shape({
    sortBy: PropTypes.string.isRequired,
    sortDirection: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
    searchText: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
}

GeozoneListProvider.defaultProps = {
  variables: {
    sortBy: 'name',
    sortDirection: 'ASC',
  },
}

GeozoneListProvider.Consumer = Consumer

export default GeozoneListProvider
