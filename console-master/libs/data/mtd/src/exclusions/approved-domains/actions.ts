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

export const fetchApprovedDomainsStart = (payload: PageableSortableQueryParams<IWebAddress>, apiProvider: ApiProvider) => ({
  type: ActionType.FetchApprovedDomainsStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchApprovedDomainsSuccess = (payload: Task<EntitiesPageableResponse<IWebAddress>>) => ({
  type: ActionType.FetchApprovedDomainsSuccess,
  payload,
})

export const fetchApprovedDomainsError = (error: Error) => ({
  type: ActionType.FetchApprovedDomainsError,
  payload: { error },
})

export const createApprovedDomainStart = (payload: IWebAddress, apiProvider: ApiProvider) => ({
  type: ActionType.CreateApprovedDomainStart,
  payload: { apiProvider, domain: payload },
})

export const createApprovedDomainSuccess = () => ({
  type: ActionType.CreateApprovedDomainSuccess,
})

export const createApprovedDomainError = (error: Error) => ({
  type: ActionType.CreateApprovedDomainError,
  payload: { error },
})

export const editApprovedDomainStart = (payload: IWebAddress, apiProvider: ApiProvider) => ({
  type: ActionType.EditApprovedDomainStart,
  payload: { apiProvider, domain: payload },
})

export const editApprovedDomainSuccess = () => ({
  type: ActionType.EditApprovedDomainSuccess,
})

export const editApprovedDomainError = (error: Error) => ({
  type: ActionType.EditApprovedDomainError,
  payload: { error },
})

export const deleteApprovedDomainStart = (payload: { entityId: string }, apiProvider: ApiProvider) => ({
  type: ActionType.DeleteApprovedDomainStart,
  payload: { ...payload, apiProvider },
})

export const deleteApprovedDomainSuccess = () => ({
  type: ActionType.DeleteApprovedDomainSuccess,
})

export const deleteApprovedDomainError = (error: Error) => ({
  type: ActionType.DeleteApprovedDomainError,
  payload: { error },
})

export const deleteMultipleApprovedDomainsStart = (payload: { entityIds: string[] }, apiProvider: ApiProvider) => ({
  type: ActionType.DeleteMultipleApprovedDomainsStart,
  payload: { ...payload, apiProvider },
})

export const deleteMultipleApprovedDomainsSuccess = (payload: Task<BulkDeleteResponse>) => ({
  type: ActionType.DeleteMultipleApprovedDomainsSuccess,
  payload,
})

export const deleteMultipleApprovedDomainsError = (error: Error) => ({
  type: ActionType.DeleteMultipleApprovedDomainsError,
  payload: { error },
})

export const importApprovedDomainsStart = (payload: File, apiProvider: ApiProvider) => ({
  type: ActionType.ImportApprovedDomainsStart,
  payload: { apiProvider, file: payload },
})

export const importApprovedDomainsSuccess = (payload: Task<CsvResult<CsvRecordFailure>>) => ({
  type: ActionType.ImportApprovedDomainsSuccess,
  payload,
})

export const importApprovedDomainsError = (error: Error) => ({
  type: ActionType.ImportApprovedDomainsError,
  payload: { error },
})
