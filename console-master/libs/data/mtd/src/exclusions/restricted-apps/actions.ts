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

export const fetchRestrictedApplicationsStart = (payload: PageableSortableQueryParams<IAppInfo>, apiProvider: ApiProvider) => ({
  type: ActionType.FetchRestrictedApplicationsStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchRestrictedApplicationsSuccess = (payload: Task<EntitiesPageableResponse<IAppInfo>>) => ({
  type: ActionType.FetchRestrictedApplicationsSuccess,
  payload,
})

export const fetchRestrictedApplicationsError = (error: Error) => ({
  type: ActionType.FetchRestrictedApplicationsError,
  payload: { error },
})

export const createRestrictedApplicationStart = (payload: IAppInfo, apiProvider: ApiProvider) => ({
  type: ActionType.CreateRestrictedApplicationStart,
  payload: { apiProvider, application: payload },
})

export const createRestrictedApplicationSuccess = () => ({
  type: ActionType.CreateRestrictedApplicationSuccess,
})

export const createRestrictedApplicationError = (error: Error) => ({
  type: ActionType.CreateRestrictedApplicationError,
  payload: { error },
})

export const importRestrictedApplicationsStart = (payload: File, apiProvider: ApiProvider) => ({
  type: ActionType.ImportRestrictedApplicationsStart,
  payload: { apiProvider, file: payload },
})

export const importRestrictedApplicationsSuccess = (payload: Task<CsvResult<CsvRecordFailure>>) => ({
  type: ActionType.ImportRestrictedApplicationsSuccess,
  payload,
})

export const importRestrictedApplicationsError = (error: Error) => ({
  type: ActionType.ImportRestrictedApplicationsError,
  payload: { error },
})

export const editRestrictedApplicationStart = (payload: IAppInfo, apiProvider: ApiProvider) => ({
  type: ActionType.EditRestrictedApplicationStart,
  payload: { apiProvider, application: payload },
})

export const editRestrictedApplicationSuccess = () => ({
  type: ActionType.EditRestrictedApplicationSuccess,
})

export const editRestrictedApplicationError = (error: Error) => ({
  type: ActionType.EditRestrictedApplicationError,
  payload: { error },
})

export const deleteRestrictedApplicationsStart = (payload: { entityIds: string[] }, apiProvider: ApiProvider) => ({
  type: ActionType.DeleteRestrictedApplicationsStart,
  payload: { ...payload, apiProvider },
})

export const deleteRestrictedApplicationsSuccess = (payload: Task<BulkDeleteResponse>) => ({
  type: ActionType.DeleteRestrictedApplicationsSuccess,
  payload,
})

export const deleteRestrictedApplicationsError = (error: Error) => ({
  type: ActionType.DeleteRestrictedApplicationsError,
  payload: { error },
})
