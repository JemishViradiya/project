/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type {
  FileSettings,
  RemediationSettings,
  TenantConfig,
  TenantConfigsApi,
  TenantConfigsMockApi,
} from '../tenant-settings-service'
import type { Task } from '../types'

export type ApiProvider = typeof TenantConfigsApi | typeof TenantConfigsMockApi

export const TenantConfigsReduxSlice = 'app.dlp.tenantConfigs'

export enum TaskId {
  FetchConfigs = 'fetchConfigs',
  UpdateConfigs = 'updateConfigs',
  FetchFileSettings = 'fetchFileSettings',
  UpdateFileSettings = 'updateFileSettings',
  FetchRemediationSettings = 'fetchRemediationSettings',
  UpdateRemediationSettings = 'updateRemediationSettings',
}

export interface TenantConfigsState {
  tasks?: {
    fetchConfigs: Task<TenantConfig>
    updateConfigs: Task<TenantConfig>
    fetchFileSettings: Task<FileSettings>
    updateFileSettings: Task<FileSettings>
    fetchRemediationSettings: Task<RemediationSettings>
    updateRemediationSettings: Task<RemediationSettings>
  }
}

export const ConfigsActionType = {
  FetchConfigsStart: `${TenantConfigsReduxSlice}/fetch-configs-start`,
  FetchConfigsError: `${TenantConfigsReduxSlice}/fetch-configs-error`,
  FetchConfigsSuccess: `${TenantConfigsReduxSlice}/fetch-configs-success`,

  UpdateConfigsStart: `${TenantConfigsReduxSlice}/update-configs-start`,
  UpdateConfigsError: `${TenantConfigsReduxSlice}/update-configs-error`,
  UpdateConfigsSuccess: `${TenantConfigsReduxSlice}/update-configs-success`,

  FetchFileSettingsStart: `${TenantConfigsReduxSlice}/fetch-file-settings-start`,
  FetchFileSettingsError: `${TenantConfigsReduxSlice}/fetch-file-settings-error`,
  FetchFileSettingsSuccess: `${TenantConfigsReduxSlice}/fetch-file-settings-success`,

  UpdateFileSettingsStart: `${TenantConfigsReduxSlice}/update-file-settings-start`,
  UpdateFileSettingsError: `${TenantConfigsReduxSlice}/update-file-settings-error`,
  UpdateFileSettingsSuccess: `${TenantConfigsReduxSlice}/update-file-settings-success`,

  FetchRemediationSettingsStart: `${TenantConfigsReduxSlice}/fetch-remediation-settings-start`,
  FetchRemediationSettingsError: `${TenantConfigsReduxSlice}/fetch-remediation-settings-error`,
  FetchRemediationSettingsSuccess: `${TenantConfigsReduxSlice}/fetch-remediation-settings-success`,

  UpdateRemediationSettingsStart: `${TenantConfigsReduxSlice}/update-remediation-settings-start`,
  UpdateRemediationSettingsError: `${TenantConfigsReduxSlice}/update-remediation-settings-error`,
  UpdateRemediationSettingsSuccess: `${TenantConfigsReduxSlice}/update-remediation-settings-success`,
}

// // eslint-disable-next-line no-redeclare
export type ConfigsActionType = string
