import PropTypes from 'prop-types'
import React, { createContext, useMemo } from 'react'

import { ITPolicyOverrideProfilesQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

import useClientParams from '../components/hooks/useClientParams'

export const Context = createContext([])
const { Provider, Consumer } = Context

const ITPolicyOverrideProfilesContext = ({ children }) => {
  const { features: { MdmActions = false } = {} } = useClientParams()
  const { loading, error, data = {} } = useStatefulApolloQuery(ITPolicyOverrideProfilesQuery, { skip: !MdmActions })
  const { itPolicyOverrideProfiles } = data

  const value = useMemo(
    () => ({
      loading,
      error,
      data: itPolicyOverrideProfiles,
    }),
    [loading, error, itPolicyOverrideProfiles],
  )

  return <Provider value={value}>{children}</Provider>
}

ITPolicyOverrideProfilesContext.propTypes = {
  children: PropTypes.node.isRequired,
}

ITPolicyOverrideProfilesContext.Consumer = Consumer

export default ITPolicyOverrideProfilesContext
