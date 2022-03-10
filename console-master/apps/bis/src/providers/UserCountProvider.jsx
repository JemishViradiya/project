import PropTypes from 'prop-types'
import React, { createContext, memo } from 'react'

import { UserCountQuery } from '@ues-data/bis'
import { useStatefulApolloSubscription } from '@ues-data/shared'

const { Provider, Consumer } = createContext([])
const UserCountProvider = memo(({ variables, children }) => {
  const value = useStatefulApolloSubscription(UserCountQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })
  return <Provider value={value}>{children}</Provider>
})

UserCountProvider.propTypes = {
  variables: PropTypes.object,
  children: PropTypes.node.isRequired,
}

UserCountProvider.defaultProps = {
  variables: {},
}

UserCountProvider.Consumer = Consumer

export default UserCountProvider
