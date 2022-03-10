/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { FeatureName, FeaturizationApi } from '@ues-data/shared'

import type { BulkDeleteResponse, CsvRecordFailure, CsvResult, EntitiesPageableResponse, IAppInfo } from '../../types'
import { MtdApi, MtdApiRestrictedMock } from '../api'
import {
  ExclusionCreatePermissions,
  ExclusionDeletePermissions,
  ExclusionReadPermissions,
  ExclusionUpdatePermissions,
} from '../shared/permissions'
import {
  createRestrictedApplicationStart,
  deleteRestrictedApplicationsStart,
  editRestrictedApplicationStart,
  fetchRestrictedApplicationsStart,
  importRestrictedApplicationsStart,
} from './actions'
import {
  getCreateRestrictedAppTask,
  getDeleteRestrictedAppsTask,
  getEditRestrictedAppTask,
  getImportRestrictedAppTask,
  getRestrictedAppsTask,
} from './selectors'
import type { RestrictedAppsState } from './types'
import { ReduxSlice } from './types'

export const queryRestrictedApps: ReduxQuery<
  EntitiesPageableResponse<IAppInfo>,
  Parameters<typeof fetchRestrictedApplicationsStart>[0],
  RestrictedAppsState['tasks']['restrictedApps']
> = {
  query: payload => fetchRestrictedApplicationsStart(payload, MtdApi),
  mockQuery: payload => fetchRestrictedApplicationsStart(payload, apiForMocks()),
  selector: () => getRestrictedAppsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionReadPermissions,
}

export const mutationCreateRestrictedApplication: ReduxMutation<
  IAppInfo,
  Parameters<typeof createRestrictedApplicationStart>[0],
  RestrictedAppsState['tasks']['createRestrictedApp']
> = {
  mutation: payload => createRestrictedApplicationStart(payload, MtdApi),
  mockMutation: payload => createRestrictedApplicationStart(payload, apiForMocks()),
  selector: () => getCreateRestrictedAppTask,
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

export const mutationImportRestrictedApplication: ReduxMutation<
  CsvResult<CsvRecordFailure>,
  Parameters<typeof importRestrictedApplicationsStart>[0],
  RestrictedAppsState['tasks']['importRestrictedApps']
> = {
  mutation: payload => importRestrictedApplicationsStart(payload, MtdApi),
  mockMutation: payload => importRestrictedApplicationsStart(payload, apiForMocks()),
  selector: () => getImportRestrictedAppTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

export const mutationEditRestrictedApplication: ReduxMutation<
  void,
  Parameters<typeof editRestrictedApplicationStart>[0],
  RestrictedAppsState['tasks']['editRestrictedApp']
> = {
  mutation: payload => editRestrictedApplicationStart(payload, MtdApi),
  mockMutation: payload => editRestrictedApplicationStart(payload, apiForMocks()),
  selector: () => getEditRestrictedAppTask,
  slice: ReduxSlice,
  permissions: ExclusionUpdatePermissions,
}

export const mutationDeleteRestrictedApplications: ReduxMutation<
  BulkDeleteResponse,
  Parameters<typeof deleteRestrictedApplicationsStart>[0],
  RestrictedAppsState['tasks']['deleteRestrictedApps']
> = {
  mutation: payload => deleteRestrictedApplicationsStart(payload, MtdApi),
  mockMutation: payload => deleteRestrictedApplicationsStart(payload, apiForMocks()),
  selector: () => getDeleteRestrictedAppsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionDeletePermissions,
}

const apiForMocks = () => {
  return FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode) ? MtdApi : MtdApiRestrictedMock
}
