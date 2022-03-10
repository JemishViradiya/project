// ******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { NetworkProtectionConfig } from '@ues-data/gateway'
import { GatewayApi, GatewayApiMock } from '@ues-data/gateway'
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'

import { TenantReadPermissions, TenantUpdatePermissions } from '../permissions'
import { fetchNetworkProtectionConfigStartAction, updateNetworkProtectionConfigStartAction } from './actions'
import { getNetworkProtectionConfigTask, getUpdateNetworkProtectionConfigTask } from './selectors'

export const queryNetworkProtectionConfig: ReduxQuery<
  NetworkProtectionConfig,
  Parameters<typeof fetchNetworkProtectionConfigStartAction>[0],
  ReturnType<typeof getNetworkProtectionConfigTask>
> = {
  query: () => fetchNetworkProtectionConfigStartAction(GatewayApi),
  mockQuery: () => fetchNetworkProtectionConfigStartAction(GatewayApiMock),
  permissions: TenantReadPermissions,
  selector: () => getNetworkProtectionConfigTask,
}

export const mutationUpdateNetworkProtectionConfig: ReduxMutation<
  Partial<NetworkProtectionConfig>,
  Parameters<typeof updateNetworkProtectionConfigStartAction>[0],
  ReturnType<typeof getUpdateNetworkProtectionConfigTask>
> = {
  mutation: payload => updateNetworkProtectionConfigStartAction(payload, GatewayApi),
  mockMutation: payload => updateNetworkProtectionConfigStartAction(payload, GatewayApiMock),
  permissions: TenantUpdatePermissions,
  selector: () => getUpdateNetworkProtectionConfigTask,
}
