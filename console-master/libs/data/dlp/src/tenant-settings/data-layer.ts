/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { Permission } from '@ues-data/shared'

import type { FileSettings, RemediationSettings, TenantConfig } from '../tenant-settings-service'
import { TenantConfigsApi, TenantConfigsMockApi } from '../tenant-settings-service'
import {
  fetchConfigsStart,
  fetchFileSettingsStart,
  fetchRemediationSettingsStart,
  updateConfigsStart,
  updateFileSettingsStart,
  updateRemediationSettingsStart,
} from './actions'
import type { TaskId, TenantConfigsState } from './configs-types'
import { TenantConfigsReduxSlice } from './configs-types'
import {
  getFetchConfigsTask,
  getFetchFileSettingsTask,
  getRemediationSettingsTask,
  getUpdateConfigsTask,
  getUpdateFileSettingsTask,
  getUpdateRemediationSettingsTask,
} from './selectors'

const permissions = new Set([Permission.BIP_SETTINGS_READ])

// server response comes unwrapped to Response or PagebleResponse
export const fetchConfigs: ReduxQuery<
  TenantConfig,
  Parameters<typeof fetchConfigsStart>[0],
  TenantConfigsState['tasks'][TaskId.FetchConfigs]
> = {
  query: payload => fetchConfigsStart(payload, TenantConfigsApi),
  mockQuery: payload => fetchConfigsStart(payload, TenantConfigsMockApi),
  selector: () => getFetchConfigsTask,
  dataProp: 'result',
  slice: TenantConfigsReduxSlice,
  permissions,
}

export const mutationUpdateConfigs: ReduxMutation<
  void,
  Parameters<typeof updateConfigsStart>[0],
  TenantConfigsState['tasks'][TaskId.UpdateConfigs]
> = {
  mutation: payload => updateConfigsStart(payload, TenantConfigsApi),
  mockMutation: payload => updateConfigsStart(payload, TenantConfigsMockApi),
  selector: () => getUpdateConfigsTask,
  slice: TenantConfigsReduxSlice,
  permissions,
}

export const fetchFileSettings: ReduxQuery<
  FileSettings,
  Parameters<typeof fetchFileSettingsStart>[0],
  TenantConfigsState['tasks'][TaskId.FetchFileSettings]
> = {
  query: payload => fetchFileSettingsStart(payload, TenantConfigsApi),
  mockQuery: payload => fetchFileSettingsStart(payload, TenantConfigsMockApi),
  selector: () => getFetchFileSettingsTask,
  dataProp: 'result',
  slice: TenantConfigsReduxSlice,
  permissions,
}

export const mutationUpdatFileSettings: ReduxMutation<
  void,
  Parameters<typeof updateFileSettingsStart>[0],
  TenantConfigsState['tasks'][TaskId.UpdateFileSettings]
> = {
  mutation: payload => updateFileSettingsStart(payload, TenantConfigsApi),
  mockMutation: payload => updateFileSettingsStart(payload, TenantConfigsMockApi),
  selector: () => getUpdateFileSettingsTask,
  slice: TenantConfigsReduxSlice,
}

export const fetchRemediationSettings: ReduxQuery<
  RemediationSettings,
  Parameters<typeof fetchRemediationSettingsStart>[0],
  TenantConfigsState['tasks'][TaskId.FetchRemediationSettings]
> = {
  query: payload => fetchRemediationSettingsStart(payload, TenantConfigsApi),
  mockQuery: payload => fetchRemediationSettingsStart(payload, TenantConfigsMockApi),
  selector: () => getRemediationSettingsTask,
  dataProp: 'result',
  slice: TenantConfigsReduxSlice,
  permissions,
}

export const mutationUpdateRemediationSettings: ReduxMutation<
  RemediationSettings,
  Parameters<typeof updateRemediationSettingsStart>[0],
  TenantConfigsState['tasks'][TaskId.UpdateRemediationSettings]
> = {
  mutation: payload => updateRemediationSettingsStart(payload, TenantConfigsApi),
  mockMutation: payload => updateRemediationSettingsStart(payload, TenantConfigsMockApi),
  selector: () => getUpdateRemediationSettingsTask,
  dataProp: 'result',
  slice: TenantConfigsReduxSlice,
  permissions,
}
