/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { BcnConfigSettings, BCNConnection } from '../common'

export const ReduxSlice = 'app.platform.bcn'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export interface BcnState {
  tasks?: {
    bcnInstances: Task<BCNConnection[]>
    deleteInstance: Task
    bcnSettings: Task<any>
  }
}

export const ActionType = {
  GetConnectionsStart: `${ReduxSlice}/get-connections-start`,
  GetConnectionsError: `${ReduxSlice}/get-connections-error`,
  GetConnectionsSuccess: `${ReduxSlice}/get-connections-success`,

  DeleteConnectionStart: `${ReduxSlice}/delete-connection-start`,
  DeleteConnectionError: `${ReduxSlice}/delete-connection-error`,
  DeleteConnectionSuccess: `${ReduxSlice}/delete-connection-success`,

  GetSettingsStart: `${ReduxSlice}/get-settings-start`,
  GetSettingsError: `${ReduxSlice}/get-settings-error`,
  GetSettingsSuccess: `${ReduxSlice}/get-settings-success`,

  SetLocalSettings: `${ReduxSlice}/set-local-settings`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
