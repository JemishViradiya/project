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
  IAppInfo,
  PageableSortableQueryParams,
  Task,
} from '../../types'
import type { ApiProvider } from './types'
import { ActionType } from './types'

export const fetchApprovedApplicationsStart = (payload: PageableSortableQueryParams<IAppInfo>, apiProvider: ApiProvider) => ({
  type: ActionType.FetchApprovedApplicationsStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchApprovedApplicationsSuccess = (payload: Task<EntitiesPageableResponse<IAppInfo>>) => ({
  type: ActionType.FetchApprovedApplicationsSuccess,
  payload,
})

export const fetchApprovedApplicationsError = (error: Error) => ({
  type: ActionType.FetchApprovedApplicationsError,
  payload: { error },
})

export const createApprovedApplicationStart = (payload: IAppInfo, apiProvider: ApiProvider) => ({
  type: ActionType.CreateApprovedApplicationStart,
  payload: { apiProvider, application: payload },
})

export const createApprovedApplicationSuccess = () => ({
  type: ActionType.CreateApprovedApplicationSuccess,
})

export const createApprovedApplicationError = (error: Error) => ({
  type: ActionType.CreateApprovedApplicationError,
  payload: { error },
})

export const importApprovedApplicationsStart = (payload: File, apiProvider: ApiProvider) => ({
  type: ActionType.ImportApprovedApplicationsStart,
  payload: { apiProvider, file: payload },
})

export const importApprovedApplicationsSuccess = (payload: Task<CsvResult<CsvRecordFailure>>) => ({
  type: ActionType.ImportApprovedApplicationsSuccess,
  payload,
})

export const importApprovedApplicationsError = (error: Error) => ({
  type: ActionType.ImportApprovedApplicationsError,
  payload: { error },
})

export const editApprovedApplicationStart = (payload: IAppInfo, apiProvider: ApiProvider) => ({
  type: ActionType.EditApprovedApplicationStart,
  payload: { apiProvider, application: payload },
})

export const editApprovedApplicationSuccess = () => ({
  type: ActionType.EditApprovedApplicationSuccess,
})

export const editApprovedApplicationError = (error: Error) => ({
  type: ActionType.EditApprovedApplicationError,
  payload: { error },
})

export const deleteApprovedApplicationsStart = (payload: { entityIds: string[] }, apiProvider: ApiProvider) => ({
  type: ActionType.DeleteApprovedApplicationsStart,
  payload: { ...payload, apiProvider },
})

export const deleteApprovedApplicationsSuccess = (payload: Task<BulkDeleteResponse>) => ({
  type: ActionType.DeleteApprovedApplicationsSuccess,
  payload,
})

export const deleteApprovedApplicationsError = (error: Error) => ({
  type: ActionType.DeleteApprovedApplicationsError,
  payload: { error },
})
