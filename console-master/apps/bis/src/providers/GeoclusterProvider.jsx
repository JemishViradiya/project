import PropTypes from 'prop-types'
import React, { createContext, memo } from 'react'

import { GeoclusterBoxQuery, GeoclusterQuery } from '@ues-data/bis'
import { useStatefulApolloSubscription } from '@ues-data/shared'

const Context = createContext([])
const { Provider, Consumer } = Context
export const GeoclusterProvider = memo(({ variables, children }) => {
  const value = useStatefulApolloSubscription(GeoclusterQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })
  return <Provider value={value}>{children}</Provider>
})

GeoclusterProvider.propTypes = {
  variables: PropTypes.object,
  children: PropTypes.node.isRequired,
}

GeoclusterProvider.defaultProps = {
  variables: {},
}

GeoclusterProvider.Consumer = Consumer
GeoclusterProvider.Context = Context

const ContextBox = createContext([])
const { Provider: ProviderBox, Consumer: ConsumerBox } = ContextBox
export const GeoclusterBoxProvider = memo(({ variables, children }) => {
  const value = useStatefulApolloSubscription(GeoclusterBoxQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })
  return <ProviderBox value={value}>{children}</ProviderBox>
})

GeoclusterBoxProvider.propTypes = {
  variables: PropTypes.object,
  children: PropTypes.node,
}

GeoclusterBoxProvider.Consumer = ConsumerBox
GeoclusterBoxProvider.Context = ContextBox
