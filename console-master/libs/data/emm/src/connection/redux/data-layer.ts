/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { AsyncQuery, ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { FeatureName, FeaturizationApi, Permission } from '@ues-data/shared'

import { Connection } from '../connection'
import { ConnectionMock } from '../connection-mock'
import type { AppConfigRequest, Connections, GroupResponse, UEMTenants } from '../connection-types'
import { MDMGroup } from '../group'
import { MDMGroupMock } from '../group-mock'
import {
  addAppConfigStart,
  addConnectionsStart,
  getConnectionsStart,
  getGroupsStart,
  getUEMTenantsStart,
  removeConnectionStart,
  retryConnectionStart,
} from './actions'
import {
  addAppConfigTask,
  addConnectionsTask,
  getConnectionsTask,
  getGroupsTask,
  getRemoveConnectionTask,
  getUEMTenantsTask,
  retryConnectionTask,
} from './selectors'
import type { ConnectionState, Task } from './types'
import { ReduxSlice } from './types'

export const isTaskResolved = (currentTask?: Task, previousTask?: Task): boolean =>
  previousTask && currentTask && previousTask.loading === true && currentTask.loading === false

export const queryConnections: ReduxQuery<
  Array<Connections>,
  Parameters<typeof getConnectionsStart>[0],
  ReturnType<typeof getConnectionsTask>
> = {
  query: () => getConnectionsStart(Connection),
  mockQuery: () =>
    FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
      ? getConnectionsStart(Connection)
      : getConnectionsStart(ConnectionMock),
  selector: () => getConnectionsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: new Set([Permission.ECS_MDM_READ]),
}

export const mutationAddConnections: ReduxMutation<
  { newConnections: Connections[] },
  Parameters<typeof addConnectionsStart>[0],
  ConnectionState['tasks']['addConnectionList']
> = {
  mutation: payload => addConnectionsStart(payload, Connection),
  mockMutation: payload =>
    FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
      ? addConnectionsStart(payload, Connection)
      : addConnectionsStart(payload, ConnectionMock),
  selector: () => addConnectionsTask,
  slice: ReduxSlice,
}

export const mutationRemoveConnection: ReduxMutation<
  void,
  Parameters<typeof removeConnectionStart>[0],
  ConnectionState['tasks']['removeConnection']
> = {
  mutation: payload => removeConnectionStart(payload, Connection),
  mockMutation: payload =>
    FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
      ? removeConnectionStart(payload, Connection)
      : removeConnectionStart(payload, ConnectionMock),
  selector: () => getRemoveConnectionTask,
  slice: ReduxSlice,
}

export const queryUemTenants: ReduxQuery<
  UEMTenants,
  Parameters<typeof getUEMTenantsStart>[0],
  ReturnType<typeof getUEMTenantsTask>
> = {
  query: () => getUEMTenantsStart(Connection),
  mockQuery: () =>
    FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
      ? getUEMTenantsStart(Connection)
      : getUEMTenantsStart(ConnectionMock),
  selector: () => getUEMTenantsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: new Set([Permission.ECS_MDM_READ]),
}

export const mutationAddAppConfig: ReduxMutation<
  { appConfigRequest: AppConfigRequest; type: string },
  Parameters<typeof addAppConfigStart>[0],
  ConnectionState['tasks']['addAppConfig']
> = {
  mutation: payload => addAppConfigStart(payload, Connection),
  mockMutation: payload =>
    FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
      ? addAppConfigStart(payload, Connection)
      : addAppConfigStart(payload, ConnectionMock),
  selector: () => addAppConfigTask,
  slice: ReduxSlice,
}

export const queryGroups: ReduxQuery<GroupResponse, Parameters<typeof getGroupsStart>[0], ReturnType<typeof getGroupsTask>> = {
  query: payload => getGroupsStart(payload, MDMGroup),
  mockQuery: payload =>
    FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
      ? getGroupsStart(payload, MDMGroup)
      : getGroupsStart(payload, MDMGroupMock),
  selector: () => getGroupsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: new Set([Permission.ECS_MDM_READ]),
}

export const queryGroupsAsync: AsyncQuery<GroupResponse, { emmType: string; searchQuery: string }> = {
  query: async ({ emmType, searchQuery }) => {
    const data = await MDMGroup.getGroups(emmType, searchQuery)
    return data.data
  },
  mockQueryFn: async ({ emmType, searchQuery }) => {
    const data = FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
      ? await MDMGroup.getGroups(emmType, searchQuery)
      : await MDMGroupMock.getGroups(emmType, searchQuery)
    return data.data
  },
  permissions: new Set([Permission.ECS_MDM_READ]),
}

export const mutationRetryConnections: ReduxMutation<
  { newConnection: Connections },
  Parameters<typeof retryConnectionStart>[0],
  ConnectionState['tasks']['retryConnection']
> = {
  mutation: payload => retryConnectionStart(payload, Connection),
  mockMutation: payload =>
    FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
      ? retryConnectionStart(payload, Connection)
      : retryConnectionStart(payload, ConnectionMock),
  selector: () => retryConnectionTask,
  slice: ReduxSlice,
}

export const queryConnectionsAsync: AsyncQuery<Connections, { type: string }> = {
  permissions: new Set<Permission>([Permission.ECS_MDM_READ]),
  query: async ({ type }) => {
    if (type) {
      const data = await Connection.getConnectionsAsync(type)
      return data.data
    }
  },
  mockQueryFn: async ({ type }) => {
    if (type) {
      const data = FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
        ? await Connection.getConnectionsAsync(type)
        : await ConnectionMock.getConnectionsAsync(type)
      return data.data
    }
  },
}
