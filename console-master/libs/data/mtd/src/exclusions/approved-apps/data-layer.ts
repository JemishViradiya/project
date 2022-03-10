/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { FeatureName, FeaturizationApi } from '@ues-data/shared'

import type { BulkDeleteResponse, CsvRecordFailure, CsvResult, EntitiesPageableResponse, IAppInfo } from '../../types'
import { MtdApi, MtdApiMock } from '../api'
import {
  ExclusionCreatePermissions,
  ExclusionDeletePermissions,
  ExclusionReadPermissions,
  ExclusionUpdatePermissions,
} from '../shared/permissions'
import {
  createApprovedApplicationStart,
  deleteApprovedApplicationsStart,
  editApprovedApplicationStart,
  fetchApprovedApplicationsStart,
  importApprovedApplicationsStart,
} from './actions'
import {
  getApprovedAppsTask,
  getCreateApprovedAppTask,
  getDeleteApprovedAppsTask,
  getEditApprovedAppTask,
  getImportApprovedAppsTask,
} from './selectors'
import type { ApprovedAppsState } from './types'
import { ReduxSlice } from './types'

export const queryApprovedApps: ReduxQuery<
  EntitiesPageableResponse<IAppInfo>,
  Parameters<typeof fetchApprovedApplicationsStart>[0],
  ApprovedAppsState['tasks']['approvedApps']
> = {
  query: payload => fetchApprovedApplicationsStart(payload, MtdApi),
  mockQuery: payload => fetchApprovedApplicationsStart(payload, apiForMocks()),
  selector: () => getApprovedAppsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionReadPermissions,
}

export const mutationCreateApprovedApplication: ReduxMutation<
  IAppInfo,
  Parameters<typeof createApprovedApplicationStart>[0],
  ApprovedAppsState['tasks']['createApprovedApp']
> = {
  mutation: payload => createApprovedApplicationStart(payload, MtdApi),
  mockMutation: payload => createApprovedApplicationStart(payload, apiForMocks()),
  selector: () => getCreateApprovedAppTask,
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

export const mutationImportApprovedApplications: ReduxMutation<
  CsvResult<CsvRecordFailure>,
  Parameters<typeof importApprovedApplicationsStart>[0],
  ApprovedAppsState['tasks']['importApprovedApps']
> = {
  mutation: payload => importApprovedApplicationsStart(payload, MtdApi),
  mockMutation: payload => importApprovedApplicationsStart(payload, apiForMocks()),
  selector: () => getImportApprovedAppsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

export const mutationEditApprovedApplication: ReduxMutation<
  void,
  Parameters<typeof editApprovedApplicationStart>[0],
  ApprovedAppsState['tasks']['editApprovedApp']
> = {
  mutation: payload => editApprovedApplicationStart(payload, MtdApi),
  mockMutation: payload => editApprovedApplicationStart(payload, apiForMocks()),
  selector: () => getEditApprovedAppTask,
  slice: ReduxSlice,
  permissions: ExclusionUpdatePermissions,
}

export const mutationDeleteApprovedApplications: ReduxMutation<
  BulkDeleteResponse,
  Parameters<typeof deleteApprovedApplicationsStart>[0],
  ApprovedAppsState['tasks']['deleteApprovedApps']
> = {
  mutation: payload => deleteApprovedApplicationsStart(payload, MtdApi),
  mockMutation: payload => deleteApprovedApplicationsStart(payload, apiForMocks()),
  selector: () => getDeleteApprovedAppsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionDeletePermissions,
}

const apiForMocks = () => {
  return FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode) ? MtdApi : MtdApiMock
}
