/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { GroupResponse, UEMTenants } from '../connection-types'

export const ReduxSlice = 'app.emm.connections'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export interface ConnectionState {
  tasks?: {
    connectionList: Task<unknown>
    addConnectionList: Task
    removeConnection: Task
    uemTenantList: Task<UEMTenants>
    addAppConfig: Task
    groupList: Task<GroupResponse>
    retryConnection: Task
  }
}

export const ActionType = {
  GetConnectionsStart: `${ReduxSlice}/get-connections-start`,
  GetConnectionsError: `${ReduxSlice}/get-connections-error`,
  GetConnectionsSuccess: `${ReduxSlice}/get-connections-success`,

  AddConnectionsStart: `${ReduxSlice}/add-connections-start`,
  AddConnectionsError: `${ReduxSlice}/add-connections-error`,
  AddConnectionsSuccess: `${ReduxSlice}/add-connections-success`,

  RemoveConnectionStart: `${ReduxSlice}/remove-connection-start`,
  RemoveConnectionError: `${ReduxSlice}/remove-connection-error`,
  RemoveConnectionSuccess: `${ReduxSlice}/remove-connection-success`,

  EditConnectionsStart: `${ReduxSlice}/edit-connections-start`,
  EditConnectionsError: `${ReduxSlice}/edit-connections-error`,
  EditConnectionsSuccess: `${ReduxSlice}/edit-connections-success`,

  GetUEMTenantsStart: `${ReduxSlice}/get-uem-tenants-start`,
  GetUEMTenantsError: `${ReduxSlice}/get-uem-tenants-error`,
  GetUEMTenantsSuccess: `${ReduxSlice}/get-uem-tenants-success`,

  AddAppConfigStart: `${ReduxSlice}/add-app-config-start`,
  AddAppConfigError: `${ReduxSlice}/add-app-config-error`,
  AddAppConfigSuccess: `${ReduxSlice}/add-app-config-success`,

  GetGroupsStart: `${ReduxSlice}/get-groups-start`,
  GetGroupsError: `${ReduxSlice}/get-groups-error`,
  GetGroupsSuccess: `${ReduxSlice}/get-groups-success`,

  RetryConnectionStart: `${ReduxSlice}/retry-connection-start`,
  RetryConnectionSuccess: `${ReduxSlice}/retry-connection-success`,
  RetryConnectionError: `${ReduxSlice}/retry-connection-error`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
