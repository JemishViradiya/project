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
  IDeveloperCertificate,
  PageableSortableQueryParams,
  Task,
} from '../../types'
import type { ApiProvider } from './types'
import { ActionType } from './types'

export const fetchRestrictedDeveloperCertificatesStart = (
  payload: PageableSortableQueryParams<IDeveloperCertificate>,
  apiProvider: ApiProvider,
) => ({
  type: ActionType.FetchRestrictedDeveloperCertificatesStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchRestrictedDeveloperCertificatesSuccess = (payload: Task<EntitiesPageableResponse<IDeveloperCertificate>>) => ({
  type: ActionType.FetchRestrictedDeveloperCertificatesSuccess,
  payload,
})

export const fetchRestrictedDeveloperCertificatesError = (error: Error) => ({
  type: ActionType.FetchRestrictedDeveloperCertificatesError,
  payload: { error },
})

export const createRestrictedDeveloperCertificateStart = (payload: IDeveloperCertificate, apiProvider: ApiProvider) => ({
  type: ActionType.CreateRestrictedDeveloperCertificateStart,
  payload: { apiProvider, developerCertificate: payload },
})

export const createRestrictedDeveloperCertificateSuccess = () => ({
  type: ActionType.CreateRestrictedDeveloperCertificateSuccess,
})

export const createRestrictedDeveloperCertificateError = (error: Error) => ({
  type: ActionType.CreateRestrictedDeveloperCertificateError,
  payload: { error },
})

export const editRestrictedDeveloperCertificateStart = (payload: IDeveloperCertificate, apiProvider: ApiProvider) => ({
  type: ActionType.EditRestrictedDeveloperCertificateStart,
  payload: { apiProvider, developerCertificate: payload },
})

export const editRestrictedDeveloperCertificateSuccess = () => ({
  type: ActionType.EditRestrictedDeveloperCertificateSuccess,
})

export const editRestrictedDeveloperCertificateError = (error: Error) => ({
  type: ActionType.EditRestrictedDeveloperCertificateError,
  payload: { error },
})

export const deleteRestrictedDeveloperCertificatesStart = (payload: { entityIds: string[] }, apiProvider: ApiProvider) => ({
  type: ActionType.DeleteRestrictedDeveloperCertificatesStart,
  payload: { ...payload, apiProvider },
})

export const deleteRestrictedDeveloperCertificatesSuccess = (payload: Task<BulkDeleteResponse>) => ({
  type: ActionType.DeleteRestrictedDeveloperCertificatesSuccess,
  payload,
})

export const deleteRestrictedDeveloperCertificatesError = (error: Error) => ({
  type: ActionType.DeleteRestrictedDeveloperCertificatesError,
  payload: { error },
})

export const importRestrictedDeveloperCertificatesStart = (payload: File, apiProvider: ApiProvider) => ({
  type: ActionType.ImportRestrictedDeveloperCertificatesStart,
  payload: { apiProvider, file: payload },
})

export const importRestrictedDeveloperCertificatesSuccess = (payload: Task<CsvResult<CsvRecordFailure>>) => ({
  type: ActionType.ImportRestrictedDeveloperCertificatesSuccess,
  payload,
})

export const importRestrictedDeveloperCertificatesError = (error: Error) => ({
  type: ActionType.ImportRestrictedDeveloperCertificatesError,
  payload: { error },
})
