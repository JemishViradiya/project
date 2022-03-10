/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared'

import type { PageableSortableQueryParams } from '../types'
import type { UsersBase } from '../users-service'
import type { ApiProvider } from './types'
import { UsersActionType } from './types'

// fetch Users list
export const fetchUsersStart = (payload: { queryParams: PageableSortableQueryParams<UsersBase> }, apiProvider: ApiProvider) => ({
  type: UsersActionType.FetchUsersStart,
  payload: { ...payload, apiProvider },
})

export const fetchUsersSuccess = (payload: PagableResponse<UsersBase>) => ({
  type: UsersActionType.FetchUsersSuccess,
  payload,
})

export const fetchUsersError = (error: Error) => ({
  type: UsersActionType.FetchUsersError,
  payload: { error },
})

// fetch devices information
export const fetchDevicesStart = (payload: { userId: string }, apiProvider: ApiProvider) => ({
  type: UsersActionType.FetchDevicesStart,
  payload: { ...payload, apiProvider },
})

export const fetchDevicesSuccess = payload => ({
  type: UsersActionType.FetchDevicesSuccess,
  payload,
})

export const fetchDevicesError = (error: Error) => ({
  type: UsersActionType.FetchDevicesError,
  payload: { error },
})
