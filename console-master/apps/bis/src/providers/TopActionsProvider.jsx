import PropTypes from 'prop-types'
import React, { createContext } from 'react'

import { TopActionsQuery } from '@ues-data/bis'
import { useStatefulApolloSubscription } from '@ues-data/shared'

const { Provider, Consumer } = createContext([])
const TopActionsProvider = ({ children, variables = {} }) => {
  const value = useStatefulApolloSubscription(TopActionsQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })
  return <Provider value={value}>{children}</Provider>
}

TopActionsProvider.propTypes = {
  variables: PropTypes.object,
  children: PropTypes.node.isRequired,
}

TopActionsProvider.Consumer = Consumer

export default TopActionsProvider
