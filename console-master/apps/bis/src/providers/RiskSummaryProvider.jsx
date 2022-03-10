import PropTypes from 'prop-types'
import React, { createContext, memo } from 'react'

import { RiskSummaryQuery } from '@ues-data/bis'
import { useStatefulApolloSubscription } from '@ues-data/shared'

const { Provider, Consumer } = createContext([])
const RiskSummaryProvider = memo(({ variables, children }) => {
  const value = useStatefulApolloSubscription(RiskSummaryQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })
  return <Provider value={value}>{children}</Provider>
})

RiskSummaryProvider.propTypes = {
  variables: PropTypes.object,
  children: PropTypes.node,
}

RiskSummaryProvider.Consumer = Consumer

export default RiskSummaryProvider
