/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type {
  BulkDeleteResponse,
  CsvRecordFailure,
  CsvResult,
  EntitiesPageableResponse,
  PageableSortableQueryParams,
  Task,
} from '../../types'
import type { IWebAddress } from '../api'
import type { ApiProvider } from './types'
import { ActionType } from './types'

export const fetchRestrictedIpAddressesStart = (payload: PageableSortableQueryParams<IWebAddress>, apiProvider: ApiProvider) => ({
  type: ActionType.FetchRestrictedIpAddressesStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchRestrictedIpAddressesSuccess = (payload: Task<EntitiesPageableResponse<IWebAddress>>) => ({
  type: ActionType.FetchRestrictedIpAddressesSuccess,
  payload,
})

export const fetchRestrictedIpAddressesError = (error: Error) => ({
  type: ActionType.FetchRestrictedIpAddressesError,
  payload: { error },
})

export const createRestrictedIpAddressStart = (payload: IWebAddress, apiProvider: ApiProvider) => ({
  type: ActionType.CreateRestrictedIpAddressStart,
  payload: { apiProvider, ipAddress: payload },
})

export const createRestrictedIpAddressSuccess = () => ({
  type: ActionType.CreateRestrictedIpAddressSuccess,
})

export const createRestrictedIpAddressError = (error: Error) => ({
  type: ActionType.CreateRestrictedIpAddressError,
  payload: { error },
})

export const editRestrictedIpAddressStart = (payload: IWebAddress, apiProvider: ApiProvider) => ({
  type: ActionType.EditRestrictedIpAddressStart,
  payload: { apiProvider, ipAddress: payload },
})

export const editRestrictedIpAddressSuccess = () => ({
  type: ActionType.EditRestrictedIpAddressSuccess,
})

export const editRestrictedIpAddressError = (error: Error) => ({
  type: ActionType.EditRestrictedIpAddressError,
  payload: { error },
})

export const deleteRestrictedIpAddressesStart = (payload: { entityIds: string[] }, apiProvider: ApiProvider) => ({
  type: ActionType.DeleteRestrictedIpAddressesStart,
  payload: { ...payload, apiProvider },
})

export const deleteRestrictedIpAddressesSuccess = (payload: Task<BulkDeleteResponse>) => ({
  type: ActionType.DeleteRestrictedIpAddressesSuccess,
  payload,
})

export const deleteRestrictedIpAddressesError = (error: Error) => ({
  type: ActionType.DeleteRestrictedIpAddressesError,
  payload: { error },
})

export const importRestrictedIpAddressesStart = (payload: File, apiProvider: ApiProvider) => ({
  type: ActionType.ImportRestrictedIpAddressesStart,
  payload: { apiProvider, file: payload },
})

export const importRestrictedIpAddressesSuccess = (payload: Task<CsvResult<CsvRecordFailure>>) => ({
  type: ActionType.ImportRestrictedIpAddressesSuccess,
  payload,
})

export const importRestrictedIpAddressesError = (error: Error) => ({
  type: ActionType.ImportRestrictedIpAddressesError,
  payload: { error },
})
