import PropTypes from 'prop-types'
import React, { createContext, useCallback } from 'react'

import { NetworkAnomalyOptions } from '@ues-bis/adaptive-response-settings'
// import { DefaultAppAnomalyValues } from '@ues-bis/standalone-settings-risk-engines'
import { RiskEnginesSettingsMutation, RiskEnginesSettingsQuery } from '@ues-data/bis'
import { useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

import useClientParams from '../components/hooks/useClientParams'

export const Context = createContext([])

export const RiskEngineSettingsProvider = ({ children }) => {
  const {
    features: { IpAddressRisk = false, AppAnomalyDetection = false, NetworkAnomalyDetection = false } = {},
  } = useClientParams()
  const { loading, error, data = {} } = useStatefulApolloQuery(
    RiskEnginesSettingsQuery(AppAnomalyDetection, IpAddressRisk, NetworkAnomalyDetection),
  )
  const dataSettings = { ...(data.settings ?? {}) }

  const [setValue, mutationValue] = useStatefulApolloMutation(
    RiskEnginesSettingsMutation(AppAnomalyDetection, IpAddressRisk, NetworkAnomalyDetection),
  )
  const update = useCallback(
    ({ update, ...props }) => {
      setValue({
        ...props,
        update: (cache, { data: { settings } }) => {
          cache.writeQuery({
            query: RiskEnginesSettingsQuery(AppAnomalyDetection, IpAddressRisk, NetworkAnomalyDetection).query,
            data: { settings },
          })
          update && update(settings)
        },
      })
    },
    [AppAnomalyDetection, IpAddressRisk, NetworkAnomalyDetection, setValue],
  )

  if (!IpAddressRisk) {
    dataSettings.ipAddress = { enabled: false }
  }
  if (AppAnomalyDetection && dataSettings.appAnomalyDetection?.enabled) {
    if (!dataSettings.appAnomalyDetection?.riskLevel) {
      dataSettings.appAnomalyDetection.riskLevel = DefaultAppAnomalyValues.riskLevel
    }
    if (!dataSettings.appAnomalyDetection?.range) {
      dataSettings.appAnomalyDetection.range = DefaultAppAnomalyValues.range
    }
  }

  if (NetworkAnomalyDetection && dataSettings.networkAnomalyDetection?.enabled) {
    if (!dataSettings.networkAnomalyDetection?.riskLevel) {
      dataSettings.networkAnomalyDetection.riskLevel = NetworkAnomalyOptions.DefaultValues.riskLevel
    }
    if (!dataSettings.networkAnomalyDetection?.range) {
      dataSettings.networkAnomalyDetection.range = NetworkAnomalyOptions.DefaultValues.range
    }
  }

  const settings = { loading, error, data: dataSettings, update, saving: mutationValue.loading }

  return <Context.Provider value={settings}>{children}</Context.Provider>
}

RiskEngineSettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

RiskEngineSettingsProvider.Consumer = Context.Consumer

export default RiskEngineSettingsProvider
