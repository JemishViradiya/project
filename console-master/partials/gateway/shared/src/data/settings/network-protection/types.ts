//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { NetworkProtectionConfig } from '@ues-data/gateway'
import type { UesReduxSlices } from '@ues-data/shared'

import type { Task } from '../../../utils'
import type * as actions from './actions'

export enum TaskId {
  FetchNetworkProtectionConfigTask = 'fetchNetworkProtectionConfigTask',
  UpdateNetworkProtectionConfigTask = 'updateNetworkProtectionConfigTask',
}

export interface NetworkProtectionConfigState {
  tasks?: {
    [TaskId.FetchNetworkProtectionConfigTask]?: Task<NetworkProtectionConfig>
    [TaskId.UpdateNetworkProtectionConfigTask]?: Task
  }
  ui: {
    localNetworkProtectionConfig: Partial<NetworkProtectionConfig>
  }
}

export type NetworkProtectionConfigActions =
  | ReturnType<typeof actions.fetchNetworkProtectionConfigStartAction>
  | ReturnType<typeof actions.fetchNetworkProtectionConfigSuccessAction>
  | ReturnType<typeof actions.fetchNetworkProtectionConfigErrorAction>
  | ReturnType<typeof actions.updateNetworkProtectionConfigStartAction>
  | ReturnType<typeof actions.updateNetworkProtectionConfigSuccessAction>
  | ReturnType<typeof actions.updateNetworkProtectionConfigErrorAction>
  | ReturnType<typeof actions.updateLocalNetworkProtectionConfig>
  | ReturnType<typeof actions.clearLocalNetworkProtectionConfig>

export const ReduxSlice: UesReduxSlices = 'app.gateway.networkProtectionConfig'

export enum ActionType {
  FetchNetworkProtectionConfigStart = 'app.gateway.networkProtectionConfig/fetch-network-protection-start',
  FetchNetworkProtectionConfigError = 'app.gateway.networkProtectionConfig/fetch-network-protection-error',
  FetchNetworkProtectionConfigSuccess = 'app.gateway.networkProtectionConfig/fetch-network-protection-success',

  UpdateNetworkProtectionConfigStart = 'app.gateway.networkProtectionConfig/update-network-protection-start',
  UpdateNetworkProtectionConfigError = 'app.gateway.networkProtectionConfig/update-network-protection-error',
  UpdateNetworkProtectionConfigSuccess = 'app.gateway.networkProtectionConfig/update-network-protection-success',

  UpdateLocalNetworkProtectionConfig = 'app.gateway.networkProtectionConfig/update-local-network-protection-config',
  ClearLocalNetworkProtectionConfig = 'app.gateway.networkProtectionConfig/clear-local-network-protection-config',
}
