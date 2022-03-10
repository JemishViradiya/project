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

export const fetchRestrictedDomainsStart = (payload: PageableSortableQueryParams<IWebAddress>, apiProvider: ApiProvider) => ({
  type: ActionType.FetchRestrictedDomainsStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchRestrictedDomainsSuccess = (payload: Task<EntitiesPageableResponse<IWebAddress>>) => ({
  type: ActionType.FetchRestrictedDomainsSuccess,
  payload,
})

export const fetchRestrictedDomainsError = (error: Error) => ({
  type: ActionType.FetchRestrictedDomainsError,
  payload: { error },
})

export const createRestrictedDomainStart = (payload: IWebAddress, apiProvider: ApiProvider) => ({
  type: ActionType.CreateRestrictedDomainStart,
  payload: { apiProvider, domain: payload },
})

export const createRestrictedDomainSuccess = () => ({
  type: ActionType.CreateRestrictedDomainSuccess,
})

export const createRestrictedDomainError = (error: Error) => ({
  type: ActionType.CreateRestrictedDomainError,
  payload: { error },
})

export const editRestrictedDomainStart = (payload: IWebAddress, apiProvider: ApiProvider) => ({
  type: ActionType.EditRestrictedDomainStart,
  payload: { apiProvider, domain: payload },
})

export const editRestrictedDomainSuccess = () => ({
  type: ActionType.EditRestrictedDomainSuccess,
})

export const editRestrictedDomainError = (error: Error) => ({
  type: ActionType.EditRestrictedDomainError,
  payload: { error },
})

export const deleteRestrictedDomainStart = (payload: { entityId: string }, apiProvider: ApiProvider) => ({
  type: ActionType.DeleteRestrictedDomainStart,
  payload: { ...payload, apiProvider },
})

export const deleteRestrictedDomainSuccess = () => ({
  type: ActionType.DeleteRestrictedDomainSuccess,
})

export const deleteRestrictedDomainError = (error: Error) => ({
  type: ActionType.DeleteRestrictedDomainError,
  payload: { error },
})

export const deleteMultipleRestrictedDomainsStart = (payload: { entityIds: string[] }, apiProvider: ApiProvider) => ({
  type: ActionType.DeleteMultipleRestrictedDomainsStart,
  payload: { ...payload, apiProvider },
})

export const deleteMultipleRestrictedDomainsSuccess = (payload: Task<BulkDeleteResponse>) => ({
  type: ActionType.DeleteMultipleRestrictedDomainsSuccess,
  payload,
})

export const deleteMultipleRestrictedDomainsError = (error: Error) => ({
  type: ActionType.DeleteMultipleRestrictedDomainsError,
  payload: { error },
})

export const importRestrictedDomainsStart = (payload: File, apiProvider: ApiProvider) => ({
  type: ActionType.ImportRestrictedDomainsStart,
  payload: { apiProvider, file: payload },
})

export const importRestrictedDomainsSuccess = (payload: Task<CsvResult<CsvRecordFailure>>) => ({
  type: ActionType.ImportRestrictedDomainsSuccess,
  payload,
})

export const importRestrictedDomainsError = (error: Error) => ({
  type: ActionType.ImportRestrictedDomainsError,
  payload: { error },
})
