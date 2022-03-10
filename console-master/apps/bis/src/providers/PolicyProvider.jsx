import PropTypes from 'prop-types'
import React, { createContext, useMemo } from 'react'

import { PolicyListDetailsQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

export const Context = createContext([])
const { Provider, Consumer } = Context

export const NewPolicyProvider = ({ policy, children }) => {
  return <Provider value={policy}>{children}</Provider>
}

const PolicyProvider = ({ id, children }) => {
  const options = useMemo(
    () => ({
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
      variables: { id },
    }),
    [id],
  )
  const { error, data = {} } = useStatefulApolloQuery(PolicyListDetailsQuery, options)

  const policy = useMemo(() => {
    if (error) {
      return { error }
    }
    if (data.policy) {
      return data.policy
    }
    return { id }
  }, [data.policy, error, id])

  return <Provider value={policy}>{children}</Provider>
}

PolicyProvider.propTypes = {
  variables: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  children: PropTypes.node.isRequired,
}

PolicyProvider.Consumer = Consumer

export default PolicyProvider
