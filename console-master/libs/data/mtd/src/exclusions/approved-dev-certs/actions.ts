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

export const fetchApprovedDeveloperCertificatesStart = (
  payload: PageableSortableQueryParams<IDeveloperCertificate>,
  apiProvider: ApiProvider,
) => ({
  type: ActionType.FetchApprovedDeveloperCertificatesStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchApprovedDeveloperCertificatesSuccess = (payload: Task<EntitiesPageableResponse<IDeveloperCertificate>>) => ({
  type: ActionType.FetchApprovedDeveloperCertificatesSuccess,
  payload,
})

export const fetchApprovedDeveloperCertificatesError = (error: Error) => ({
  type: ActionType.FetchApprovedDeveloperCertificatesError,
  payload: { error },
})

export const createApprovedDeveloperCertificateStart = (payload: IDeveloperCertificate, apiProvider: ApiProvider) => ({
  type: ActionType.CreateApprovedDeveloperCertificateStart,
  payload: { apiProvider, developerCertificate: payload },
})

export const createApprovedDeveloperCertificateSuccess = () => ({
  type: ActionType.CreateApprovedDeveloperCertificateSuccess,
})

export const createApprovedDeveloperCertificateError = (error: Error) => ({
  type: ActionType.CreateApprovedDeveloperCertificateError,
  payload: { error },
})

export const editApprovedDeveloperCertificateStart = (payload: IDeveloperCertificate, apiProvider: ApiProvider) => ({
  type: ActionType.EditApprovedDeveloperCertificateStart,
  payload: { apiProvider, developerCertificate: payload },
})

export const editApprovedDeveloperCertificateSuccess = () => ({
  type: ActionType.EditApprovedDeveloperCertificateSuccess,
})

export const editApprovedDeveloperCertificateError = (error: Error) => ({
  type: ActionType.EditApprovedDeveloperCertificateError,
  payload: { error },
})

export const deleteApprovedDeveloperCertificatesStart = (payload: { entityIds: string[] }, apiProvider: ApiProvider) => ({
  type: ActionType.DeleteApprovedDeveloperCertificatesStart,
  payload: { ...payload, apiProvider },
})

export const deleteApprovedDeveloperCertificatesSuccess = (payload: Task<BulkDeleteResponse>) => ({
  type: ActionType.DeleteApprovedDeveloperCertificatesSuccess,
  payload,
})

export const deleteApprovedDeveloperCertificatesError = (error: Error) => ({
  type: ActionType.DeleteApprovedDeveloperCertificatesError,
  payload: { error },
})

export const importApprovedDeveloperCertificatesStart = (payload: File, apiProvider: ApiProvider) => ({
  type: ActionType.ImportApprovedDeveloperCertificatesStart,
  payload: { apiProvider, file: payload },
})

export const importApprovedDeveloperCertificatesSuccess = (payload: Task<CsvResult<CsvRecordFailure>>) => ({
  type: ActionType.ImportApprovedDeveloperCertificatesSuccess,
  payload,
})

export const importApprovedDeveloperCertificatesError = (error: Error) => ({
  type: ActionType.ImportApprovedDeveloperCertificatesError,
  payload: { error },
})
