/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { DevicesBase, UsersApi, UsersBase, UsersMockApi } from '../users-service'

export type ApiProvider = typeof UsersApi | typeof UsersMockApi

export const UsersReduxSlice = 'app.dlp.users'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export enum TaskId {
  GetUsers = 'getUsers',
  GetDevices = 'getDevices',
}

export interface UsersState {
  tasks?: {
    getUsers: Task<PagableResponse<UsersBase>>
    getDevices: Task<DevicesBase>
  }
}

export const UsersActionType = {
  FetchUsersStart: `${UsersReduxSlice}/fetch-users-start`,
  FetchUsersError: `${UsersReduxSlice}/fetch-users-error`,
  FetchUsersSuccess: `${UsersReduxSlice}/fetch-users-success`,

  FetchDevicesStart: `${UsersReduxSlice}/fetch-devices-start`,
  FetchDevicesError: `${UsersReduxSlice}/fetch-devices-error`,
  FetchDevicesSuccess: `${UsersReduxSlice}/fetch-devices-success`,
}

// eslint-disable-next-line no-redeclare
export type UsersActionType = string
