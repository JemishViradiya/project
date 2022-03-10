// ******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { ApiProvider } from '../../../../types'
import type { Task } from '../../../../utils'
import { createAction } from '../../../../utils'
import type { CreateSuccessType, CreateType, DeleteType, ReadSuccessType, ReadType, UpdateType } from './types'
import { ActionType } from './types'

export const fetchNetworkServicesStart = (payload: ReadType, apiProvider: ApiProvider) =>
  createAction(ActionType.FetchNetworkServicesStart, {
    ...payload,
    apiProvider,
  })

export const fetchNetworkServicesSuccess = (payload: ReadSuccessType) =>
  createAction(ActionType.FetchNetworkServicesSuccess, payload)

export const fetchNetworkServicesError = (error: Task['error']) => createAction(ActionType.FetchNetworkServicesError, { error })

export const createNetworkServiceStart = (payload: CreateType, apiProvider: ApiProvider) =>
  createAction(ActionType.CreateNetworkServiceStart, {
    ...payload,
    apiProvider,
  })

export const createNetworkServiceSuccess = (payload: CreateSuccessType) =>
  createAction(ActionType.CreateNetworkServiceSuccess, payload)

export const createNetworkServiceError = (error: Task['error']) => createAction(ActionType.CreateNetworkServiceError, { error })

export const updateNetworkServiceStart = (payload: UpdateType, apiProvider: ApiProvider) =>
  createAction(ActionType.UpdateNetworkServiceStart, {
    ...payload,
    apiProvider,
  })

export const updateNetworkServiceSuccess = (payload: UpdateType) => createAction(ActionType.UpdateNetworkServiceSuccess, payload)

export const updateNetworkServiceError = (error: Task['error']) => createAction(ActionType.UpdateNetworkServiceError, { error })

export const deleteNetworkServiceStart = (payload: DeleteType, apiProvider: ApiProvider) =>
  createAction(ActionType.DeleteNetworkServiceStart, {
    ...payload,
    apiProvider,
  })

export const deleteNetworkServiceSuccess = (payload: DeleteType) => createAction(ActionType.DeleteNetworkServiceSuccess, payload)

export const deleteNetworkServiceError = (error: Task['error']) => createAction(ActionType.DeleteNetworkServiceError, { error })
