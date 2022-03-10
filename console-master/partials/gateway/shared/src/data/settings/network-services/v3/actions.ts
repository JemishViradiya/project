// ******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { NetworkServicesV3 } from '@ues-data/gateway'

import type { ApiProvider } from '../../../../types'
import type { Task } from '../../../../utils'
import { createAction } from '../../../../utils'
import type { CreateSuccessType, CreateType, DeleteType, UpdateType } from './types'
import { ActionType } from './types'

export const fetchNetworkServiceStart = (payload: { id: string }, apiProvider: ApiProvider) =>
  createAction(ActionType.FetchNetworkServiceStart, {
    ...payload,
    apiProvider,
  })

export const fetchNetworkServiceSuccess = (payload: Task<NetworkServicesV3.NetworkServiceEntity>) =>
  createAction(ActionType.FetchNetworkServiceSuccess, payload)

export const fetchNetworkServiceError = (error: Task['error']) => createAction(ActionType.FetchNetworkServiceError, { error })

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
  createAction(ActionType.DeleteNetworkServiceStart, { ...payload, apiProvider })

export const deleteNetworkServiceSuccess = (payload: DeleteType) => createAction(ActionType.DeleteNetworkServiceSuccess, payload)

export const deleteNetworkServiceError = (error: Task['error']) => createAction(ActionType.DeleteNetworkServiceError, { error })

export const updateLocalNetworkServiceData = (payload: Partial<NetworkServicesV3.NetworkServiceEntity> | undefined) =>
  createAction(ActionType.UpdateLocalNetworkServiceData, payload)

export const clearNetworkService = () => createAction(ActionType.ClearNetworkService)
