/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { FileSettings, RemediationSettings, TenantConfig } from '../tenant-settings-service'
import type { PageableSortableQueryParams } from '../types'
import type { ApiProvider } from './configs-types'
import { ConfigsActionType } from './configs-types'

//fetch all configs settings
export const fetchConfigsStart = (payload: PageableSortableQueryParams<TenantConfig>, apiProvider: ApiProvider) => ({
  type: ConfigsActionType.FetchConfigsStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchConfigsSuccess = (payload: PagableResponse<TenantConfig>) => ({
  type: ConfigsActionType.FetchConfigsSuccess,
  payload,
})

export const fetchConfigsError = (error: Error) => ({
  type: ConfigsActionType.FetchConfigsError,
  payload: { error },
})

//upate configs
export const updateConfigsStart = (payload: { data: TenantConfig }, apiProvider: ApiProvider) => ({
  type: ConfigsActionType.UpdateConfigsStart,
  payload: { ...payload, apiProvider },
})

export const updateConfigsSuccess = () => ({
  type: ConfigsActionType.UpdateConfigsSuccess,
})

export const updateConfigsError = (error: Error) => ({
  type: ConfigsActionType.UpdateConfigsError,
  payload: { error },
})

//fetch File Settings
export const fetchFileSettingsStart = (payload: FileSettings, apiProvider: ApiProvider) => ({
  type: ConfigsActionType.FetchFileSettingsStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchFileSettingsSuccess = (payload: FileSettings) => ({
  type: ConfigsActionType.FetchFileSettingsSuccess,
  payload,
})

export const fetchFileSettingsError = (error: Error) => ({
  type: ConfigsActionType.FetchFileSettingsError,
  payload: { error },
})

//update File Settings
export const updateFileSettingsStart = (payload: { data: FileSettings }, apiProvider: ApiProvider) => ({
  type: ConfigsActionType.UpdateFileSettingsStart,
  payload: { ...payload, apiProvider },
})

export const updateFileSettingsSuccess = () => ({
  type: ConfigsActionType.UpdateFileSettingsSuccess,
})

export const updateFileSettingsError = (error: Error) => ({
  type: ConfigsActionType.UpdateFileSettingsError,
  payload: { error },
})

//fetch Remediation Settings
export const fetchRemediationSettingsStart = (payload: RemediationSettings, apiProvider: ApiProvider) => ({
  type: ConfigsActionType.FetchRemediationSettingsStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchRemediationSettingsSuccess = (payload: FileSettings) => ({
  type: ConfigsActionType.FetchRemediationSettingsSuccess,
  payload,
})

export const fetchRemediationSettingsError = (error: Error) => ({
  type: ConfigsActionType.FetchRemediationSettingsError,
  payload: { error },
})

//update Remediation Settings
export const updateRemediationSettingsStart = (payload: RemediationSettings, apiProvider: ApiProvider) => ({
  type: ConfigsActionType.UpdateRemediationSettingsStart,
  payload: { ...payload, apiProvider },
})

export const updateRemediationSettingsSuccess = (payload: FileSettings) => ({
  type: ConfigsActionType.UpdateRemediationSettingsSuccess,
  payload,
})

export const updateRemediationSettingsError = (error: Error) => ({
  type: ConfigsActionType.UpdateRemediationSettingsError,
  payload: { error },
})
