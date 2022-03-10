import PropTypes from 'prop-types'
import React, { createContext } from 'react'

import { LatestEventsQuery } from '@ues-data/bis'
import { useStatefulApolloSubscription } from '@ues-data/shared'

const context = createContext([])
const { Provider } = context

const LatestEventsProvider = ({ children }) => {
  const value = useStatefulApolloSubscription(LatestEventsQuery, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' })
  return <Provider value={value}>{children}</Provider>
}

LatestEventsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

LatestEventsProvider.Context = context

export default LatestEventsProvider
