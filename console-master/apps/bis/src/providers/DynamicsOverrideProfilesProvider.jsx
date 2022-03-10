import PropTypes from 'prop-types'
import React, { createContext, useMemo } from 'react'

import { DynamicsOverrideProfilesQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

import useClientParams from '../components/hooks/useClientParams'

export const Context = createContext([])
const { Provider, Consumer } = Context

const DynamicsOverrideProfilesContext = ({ children }) => {
  const { features: { DynamicsProfiles = false } = {} } = useClientParams()
  const { loading, error, data = {} } = useStatefulApolloQuery(DynamicsOverrideProfilesQuery, { skip: !DynamicsProfiles })
  const { dynamicsOverrideProfiles } = data

  const value = useMemo(
    () => ({
      loading,
      error,
      data: dynamicsOverrideProfiles,
    }),
    [loading, error, dynamicsOverrideProfiles],
  )

  return <Provider value={value}>{children}</Provider>
}

DynamicsOverrideProfilesContext.propTypes = {
  children: PropTypes.node.isRequired,
}

DynamicsOverrideProfilesContext.Consumer = Consumer

export default DynamicsOverrideProfilesContext
