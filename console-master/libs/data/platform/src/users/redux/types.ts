/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared'

import type { User } from '../common'

export const ReduxSlice = 'app.platform.users'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export interface UsersState {
  tasks?: {
    users: Task<PagableResponse<User>>
  }
}

export const ActionType = {
  FetchUsersStart: `${ReduxSlice}/fetch-users-start`,
  FetchUsersError: `${ReduxSlice}/fetch-users-error`,
  FetchUsersSuccess: `${ReduxSlice}/fetch-users-success`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
