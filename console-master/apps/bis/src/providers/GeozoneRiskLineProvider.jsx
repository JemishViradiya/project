import PropTypes from 'prop-types'
import React, { createContext, memo } from 'react'

import { GeozoneRiskLineQuery } from '@ues-data/bis'
import { useStatefulApolloSubscription } from '@ues-data/shared'

const { Provider, Consumer } = createContext([])
const GeozoneRiskLineProvider = memo(({ variables, children }) => {
  const value = useStatefulApolloSubscription(GeozoneRiskLineQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })
  return <Provider value={value}>{children}</Provider>
})

GeozoneRiskLineProvider.propTypes = {
  variables: PropTypes.object,
  children: PropTypes.node.isRequired,
}

GeozoneRiskLineProvider.defaultProps = {
  variables: {},
}

GeozoneRiskLineProvider.Consumer = Consumer

export default GeozoneRiskLineProvider
