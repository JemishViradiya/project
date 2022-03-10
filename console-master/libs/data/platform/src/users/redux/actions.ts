/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared'

import type UsersInterface from '../common/users-interface'
import type { User } from '../common/users-types'
import { ActionType } from './types'

export const fetchUsersStart = (
  payload: {
    max?: number
    offset?: number
    query?: string
    sortBy?: string
  },
  apiProvider: UsersInterface,
) => ({
  type: ActionType.FetchUsersStart,
  payload: { ...payload, apiProvider },
})

export const fetchUsersSuccess = (payload: PagableResponse<User>) => ({
  type: ActionType.FetchUsersSuccess,
  payload: { users: payload },
})

export const fetchUsersError = (error: Error) => ({
  type: ActionType.FetchUsersError,
  payload: { error },
})
