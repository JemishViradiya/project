import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

import { UserListQuery } from '@ues-data/bis'

import useClientParams from '../components/hooks/useClientParams'
import ListProvider from './ListProvider'

export const UserListContext = createContext([])
const { Provider, Consumer } = UserListContext
const loaderOpts = { key: 'users', dataKey: 'users' }

export const useUserListContext = () => useContext(UserListContext)

const UserListProvider = ({ variables = {}, children }) => {
  const {
    privacyMode: { mode: privacyMode = true } = {},
    features: { RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection },
  } = useClientParams() || {}
  const query = UserListQuery(privacyMode, RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection)
  return (
    <ListProvider query={query} provider={Provider} variables={variables} loaderOptions={loaderOpts}>
      {children}
    </ListProvider>
  )
}

UserListProvider.propTypes = {
  variables: PropTypes.object,
  children: PropTypes.node.isRequired,
}

UserListProvider.Consumer = Consumer

export default UserListProvider
