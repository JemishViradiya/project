import PropTypes from 'prop-types'
import React, { createContext, memo } from 'react'

import { BehavioralRiskLineQuery } from '@ues-data/bis'
import { useStatefulApolloSubscription } from '@ues-data/shared'

const { Provider, Consumer } = createContext([])
const BehaviorRiskLineProvider = memo(({ variables, children }) => {
  const value = useStatefulApolloSubscription(BehavioralRiskLineQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })
  return <Provider value={value}>{children}</Provider>
})

BehaviorRiskLineProvider.propTypes = {
  variables: PropTypes.object,
  children: PropTypes.node.isRequired,
}

BehaviorRiskLineProvider.defaultProps = {
  variables: {},
}

BehaviorRiskLineProvider.Consumer = Consumer

export default BehaviorRiskLineProvider
