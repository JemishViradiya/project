//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { TenantConfiguration, TenantHealthEntity } from '@ues-data/gateway'
import type { UesReduxSlices } from '@ues-data/shared'

import type { Task } from '../../../utils'
import type * as actions from './actions'

export enum TaskId {
  FetchTenantConfigTask = 'fetchTenantConfigTask',
  UpdateTenantConfigTask = 'updateTenantConfigTask',
  FetchTenantHealthTask = 'fetchTenantHealthTask',
}

export interface TenantConfigState {
  tasks: {
    [TaskId.FetchTenantConfigTask]?: Task<TenantConfiguration>
    [TaskId.UpdateTenantConfigTask]?: Task
    [TaskId.FetchTenantHealthTask]?: Task<TenantHealthEntity>
  }
  ui: {
    localTenantConfig: Partial<TenantConfiguration>
  }
}

export type TenantConfigActions =
  | ReturnType<typeof actions.fetchTenantConfigStartAction>
  | ReturnType<typeof actions.fetchTenantConfigSuccessAction>
  | ReturnType<typeof actions.fetchTenantConfigErrorAction>
  | ReturnType<typeof actions.updateTenantConfigStartAction>
  | ReturnType<typeof actions.updateTenantConfigErrorAction>
  | ReturnType<typeof actions.updateTenantConfigSuccessAction>
  | ReturnType<typeof actions.updateLocalTenantConfig>
  | ReturnType<typeof actions.clearLocalTenantConfig>
  | ReturnType<typeof actions.fetchTenantHealthStartAction>
  | ReturnType<typeof actions.fetchTenantHealthSuccessAction>
  | ReturnType<typeof actions.fetchTenantHealthErrorAction>

export const ReduxSlice: UesReduxSlices = 'app.gateway.tenantConfig'

export enum ActionType {
  FetchTenantConfigStart = 'app.gateway.tenantConfig/fetch-tenant-config-start',
  FetchTenantConfigError = 'app.gateway.tenantConfig/fetch-tenant-config-error',
  FetchTenantConfigSuccess = 'app.gateway.tenantConfig/fetch-tenant-config-success',

  UpdateTenantConfigStart = 'app.gateway.tenantConfig/update-tenant-start',
  UpdateTenantConfigError = 'app.gateway.tenantConfig/update-tenant-error',
  UpdateTenantConfigSuccess = 'app.gateway.tenantConfig/update-tenant-success',

  UpdateLocalTenantConfig = 'app.gateway.tenantConfig/update-local-tenant-config',
  ClearLocalTenantConfig = 'app.gateway.tenantConfig/clear-local-tenant-config',

  FetchTenantHealthStart = 'app.gateway.tenantConfig/fetch-tenant-health-start',
  FetchTenantHealthError = 'app.gateway.tenantConfig/fetch-tenant-health-error',
  FetchTenantHealthSuccess = 'app.gateway.tenantConfig/fetch-tenant-health-success',
}
