import PropTypes from 'prop-types'
import React, { createContext, memo } from 'react'

import { UserRiskEventQuery } from '@ues-data/bis'

import useSubscribeByDefault from './SubscribeByDefaultProvider'

export const Context = createContext([])
const { Provider, Consumer } = Context
const UserRiskEventProvider = memo(({ variables, children }) => {
  const range = variables.range
  const subscribe = range && !range.end
  const { subscription, query, ...rest } = UserRiskEventQuery
  const value = useSubscribeByDefault(
    {
      query,
      ...(subscribe && { subscription, ...rest }),
    },
    { variables },
  )
  return <Provider value={value}>{children}</Provider>
})

UserRiskEventProvider.propTypes = {
  variables: PropTypes.object,
  children: PropTypes.node.isRequired,
}

UserRiskEventProvider.defaultProps = {
  variables: {},
}

UserRiskEventProvider.Consumer = Consumer

export default UserRiskEventProvider
