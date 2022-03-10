import PropTypes from 'prop-types'
import React, { createContext, memo } from 'react'

import { EventCountQuery } from '@ues-data/bis'
import { useStatefulApolloSubscription } from '@ues-data/shared'

const { Provider, Consumer } = createContext([])
const EventCountProvider = memo(({ variables, children }) => {
  const value = useStatefulApolloSubscription(EventCountQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })
  return <Provider value={value}>{children}</Provider>
})

EventCountProvider.propTypes = {
  variables: PropTypes.object,
  children: PropTypes.node.isRequired,
}

EventCountProvider.defaultProps = {
  variables: {},
}

EventCountProvider.Consumer = Consumer

export default EventCountProvider
