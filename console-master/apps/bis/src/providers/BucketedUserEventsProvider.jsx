import PropTypes from 'prop-types'
import React from 'react'

import { BucketedUserEventsQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

import useClientParams from '../components/hooks/useClientParams'

const context = React.createContext([])
const { Provider } = context

const BucketedUserEventsProvider = ({ variables, children }) => {
  const {
    features: { RiskScoreResponseFormat = false, IpAddressRisk = false, NetworkAnomalyDetection = false } = {},
  } = useClientParams()
  const query = BucketedUserEventsQuery(RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection)
  const value = useStatefulApolloQuery(query, { variables })
  return <Provider value={value}>{children}</Provider>
}

BucketedUserEventsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

BucketedUserEventsProvider.Context = context
BucketedUserEventsProvider.displayName = 'BucketedUserEventsProvider'

export default BucketedUserEventsProvider
