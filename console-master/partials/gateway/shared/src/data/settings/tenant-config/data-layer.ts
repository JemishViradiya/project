//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { TenantConfiguration, TenantHealthEntity } from '@ues-data/gateway'
import { GatewayApi, GatewayApiMock } from '@ues-data/gateway'
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'

import { TenantReadPermissions, TenantUpdatePermissions } from '../permissions'
import { fetchTenantConfigStartAction, fetchTenantHealthStartAction, updateTenantConfigStartAction } from './actions'
import { getTenantConfigurationTask, getTenantHealthTask, getUpdateTenantConfigurationTask } from './selectors'

export const queryTenantConfig: ReduxQuery<
  TenantConfiguration,
  Parameters<typeof fetchTenantConfigStartAction>[0],
  ReturnType<typeof getTenantConfigurationTask>
> = {
  query: () => fetchTenantConfigStartAction(GatewayApi),
  mockQuery: () => fetchTenantConfigStartAction(GatewayApiMock),
  permissions: TenantReadPermissions,
  selector: () => getTenantConfigurationTask,
}

export const mutationUpdateTenantConfig: ReduxMutation<
  Partial<TenantConfiguration>,
  Parameters<typeof updateTenantConfigStartAction>[0],
  ReturnType<typeof getUpdateTenantConfigurationTask>
> = {
  mutation: payload => updateTenantConfigStartAction(payload, GatewayApi),
  mockMutation: payload => updateTenantConfigStartAction(payload, GatewayApiMock),
  permissions: TenantUpdatePermissions,
  selector: () => getUpdateTenantConfigurationTask,
}

export const queryTenantHealth: ReduxQuery<
  TenantHealthEntity,
  Parameters<typeof fetchTenantHealthStartAction>[0],
  ReturnType<typeof getTenantHealthTask>
> = {
  query: () => fetchTenantHealthStartAction(GatewayApi),
  mockQuery: () => fetchTenantHealthStartAction(GatewayApiMock),
  permissions: TenantReadPermissions,
  selector: () => getTenantHealthTask,
}
