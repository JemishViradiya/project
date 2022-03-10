// ******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { NetworkProtectionConfig } from '@ues-data/gateway'

import type { ApiProvider } from '../../../types'
import type { Task } from '../../../utils'
import { createAction } from '../../../utils'
import { ActionType } from './types'

export const fetchNetworkProtectionConfigStartAction = (apiProvider: ApiProvider) =>
  createAction(ActionType.FetchNetworkProtectionConfigStart, {
    apiProvider,
  })

export const fetchNetworkProtectionConfigSuccessAction = (payload: Task<NetworkProtectionConfig>) =>
  createAction(ActionType.FetchNetworkProtectionConfigSuccess, payload)

export const fetchNetworkProtectionConfigErrorAction = (error: Error) =>
  createAction(ActionType.FetchNetworkProtectionConfigError, { error })

export const updateNetworkProtectionConfigStartAction = (
  payload: { configuration: Partial<NetworkProtectionConfig> },
  apiProvider: ApiProvider,
) =>
  createAction(ActionType.UpdateNetworkProtectionConfigStart, {
    ...payload,
    apiProvider,
  })

export const updateNetworkProtectionConfigSuccessAction = (payload: Task<Partial<NetworkProtectionConfig>>) =>
  createAction(ActionType.UpdateNetworkProtectionConfigSuccess, payload)

export const updateNetworkProtectionConfigErrorAction = (error: Error) =>
  createAction(ActionType.UpdateNetworkProtectionConfigError, { error })

export const updateLocalNetworkProtectionConfig = (payload: Partial<NetworkProtectionConfig> | undefined) =>
  createAction(ActionType.UpdateLocalNetworkProtectionConfig, payload)

export const clearLocalNetworkProtectionConfig = () => createAction(ActionType.ClearLocalNetworkProtectionConfig)
