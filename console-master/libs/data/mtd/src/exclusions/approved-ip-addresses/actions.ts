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
import type { IWebAddress } from '../api/web-addresses/web-addresses-api-types'
import type { ApiProvider } from './types'
import { ActionType } from './types'

export const fetchApprovedIpAddressesStart = (payload: PageableSortableQueryParams<IWebAddress>, apiProvider: ApiProvider) => ({
  type: ActionType.FetchApprovedIpAddressesStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchApprovedIpAddressesSuccess = (payload: Task<EntitiesPageableResponse<IWebAddress>>) => ({
  type: ActionType.FetchApprovedIpAddressesSuccess,
  payload,
})

export const fetchApprovedIpAddressesError = (error: Error) => ({
  type: ActionType.FetchApprovedIpAddressesError,
  payload: { error },
})

export const createApprovedIpAddressStart = (payload: IWebAddress, apiProvider: ApiProvider) => ({
  type: ActionType.CreateApprovedIpAddressStart,
  payload: { apiProvider, ipAddress: payload },
})

export const createApprovedIpAddressSuccess = () => ({
  type: ActionType.CreateApprovedIpAddressSuccess,
})

export const createApprovedIpAddressError = (error: Error) => ({
  type: ActionType.CreateApprovedIpAddressError,
  payload: { error },
})

export const editApprovedIpAddressStart = (payload: IWebAddress, apiProvider: ApiProvider) => ({
  type: ActionType.EditApprovedIpAddressStart,
  payload: { apiProvider, ipAddress: payload },
})

export const editApprovedIpAddressSuccess = () => ({
  type: ActionType.EditApprovedIpAddressSuccess,
})

export const editApprovedIpAddressError = (error: Error) => ({
  type: ActionType.EditApprovedIpAddressError,
  payload: { error },
})

export const deleteApprovedIpAddressesStart = (payload: { entityIds: string[] }, apiProvider: ApiProvider) => ({
  type: ActionType.DeleteApprovedIpAddressesStart,
  payload: { ...payload, apiProvider },
})

export const deleteApprovedIpAddressesSuccess = (payload: Task<BulkDeleteResponse>) => ({
  type: ActionType.DeleteApprovedIpAddressesSuccess,
  payload,
})

export const deleteApprovedIpAddressesError = (error: Error) => ({
  type: ActionType.DeleteApprovedIpAddressesError,
  payload: { error },
})

export const importApprovedIpAddressesStart = (payload: File, apiProvider: ApiProvider) => ({
  type: ActionType.ImportApprovedIpAddressesStart,
  payload: { apiProvider, file: payload },
})

export const importApprovedIpAddressesSuccess = (payload: Task<CsvResult<CsvRecordFailure>>) => ({
  type: ActionType.ImportApprovedIpAddressesSuccess,
  payload,
})

export const importApprovedIpAddressesError = (error: Error) => ({
  type: ActionType.ImportApprovedIpAddressesError,
  payload: { error },
})
