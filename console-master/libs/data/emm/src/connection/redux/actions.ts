/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type ConnectionInterface from '../connection-interface'
import type { AppConfigRequest, Connections, GroupResponse, MultiStatusResponse } from '../connection-types'
import type GroupInterface from '../group-interface'
import { ActionType } from './types'

export const getConnectionsStart = (apiProvider: ConnectionInterface) => ({
  type: ActionType.GetConnectionsStart,
  payload: { apiProvider },
})

export const getConnectionsSuccess = (payload: unknown) => ({
  type: ActionType.GetConnectionsSuccess,
  payload: { emm: payload },
})

export const getConnectionsError = (error: Error) => ({
  type: ActionType.GetConnectionsError,
  payload: { error },
})

export const addConnectionsStart = (payload: { newConnections: Connections[] }, apiProvider: ConnectionInterface) => ({
  type: ActionType.AddConnectionsStart,
  payload: { ...payload, apiProvider },
})

export const addConnectionsSuccess = (payload: MultiStatusResponse) => ({
  type: ActionType.AddConnectionsSuccess,
  payload: { emm: payload },
})

export const addConnectionsError = (error: Error) => ({
  type: ActionType.AddConnectionsError,
  payload: { error },
})

export const removeConnectionStart = (payload: { type: string; force: boolean }, apiProvider: ConnectionInterface) => ({
  type: ActionType.RemoveConnectionStart,
  payload: { ...payload, apiProvider },
})

export const removeConnectionSuccess = (payload: { type: string; force: boolean }) => ({
  type: ActionType.RemoveConnectionSuccess,
  payload: { emm: payload },
})

export const removeConnectionError = (error: Error) => ({
  type: ActionType.RemoveConnectionError,
  payload: { error },
})

export const getUEMTenantsStart = (apiProvider: ConnectionInterface) => ({
  type: ActionType.GetUEMTenantsStart,
  payload: { apiProvider },
})

export const getUEMTenantsSuccess = (payload: Connections[]) => ({
  type: ActionType.GetUEMTenantsSuccess,
  payload: { emm: payload },
})

export const getUEMTenantsError = (error: Error) => ({
  type: ActionType.GetUEMTenantsError,
  payload: { error },
})

export const addAppConfigStart = (
  payload: { appConfigRequest: AppConfigRequest; type: string },
  apiProvider: ConnectionInterface,
) => ({
  type: ActionType.AddAppConfigStart,
  payload: { ...payload, apiProvider },
})

export const addAppConfigSuccess = (payload: MultiStatusResponse) => ({
  type: ActionType.AddAppConfigSuccess,
  payload: { emm: payload },
})

export const addAppConfigError = (error: Error) => ({
  type: ActionType.AddAppConfigError,
  payload: { error },
})

export const getGroupsStart = (payload: { emmType: string; searchQuery: string }, apiProvider: GroupInterface) => ({
  type: ActionType.GetGroupsStart,
  payload: { ...payload, apiProvider },
})

export const getGroupsSuccess = (payload: GroupResponse) => ({
  type: ActionType.GetGroupsSuccess,
  payload: { emm: payload },
})

export const getGroupsError = (error: Error) => ({
  type: ActionType.GetGroupsError,
  payload: { error },
})

export const retryConnectionStart = (payload: { newConnection: Connections }, apiProvider: ConnectionInterface) => ({
  type: ActionType.RetryConnectionStart,
  payload: { ...payload, apiProvider },
})

export const retryConnectionSuccess = () => ({
  type: ActionType.RetryConnectionSuccess,
  payload: {},
})

export const retryConnectionError = (error: Error) => ({
  type: ActionType.RetryConnectionError,
  payload: { error },
})
