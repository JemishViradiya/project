import React, { useMemo } from 'react'

import { PolicyRankQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

const DEFAULT_DATA = { policies: [] }

export const Context = React.createContext([])

const PolicyRankProvider = ({ children }) => {
  const { loading, error, data = DEFAULT_DATA } = useStatefulApolloQuery(PolicyRankQuery)
  const policyRank = useMemo(() => ({ loading, error, data }), [data, error, loading])

  return <Context.Provider value={policyRank}>{children}</Context.Provider>
}

export default PolicyRankProvider
