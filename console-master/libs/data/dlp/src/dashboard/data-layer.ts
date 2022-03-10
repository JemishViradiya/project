/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxQuery } from '@ues-data/shared'
import { Permission } from '@ues-data/shared'

import type {
  ActiveDevicesResponse,
  ActiveUsersResponse,
  DashboardTopEventsResponse,
  EvidenceLockerInfoResponse,
  ExfiltrtationTypeEventsResponse,
  SensitiveFilesOnEndpointsResponse,
  TotalSensitiveFilesOnEndpointsResponse,
} from '../dashboard-service'
import { DashboardDlpApi, DashboardTopEventsMockApi } from '../dashboard-service'
import {
  fetchExfiltrationEventsStart,
  getEvidenceLockerInfoStart,
  getNumberActiveDevicesStart,
  getNumberActiveUsersStart,
  getSensitiveFilesOnEndpointsStart,
  getTopEventsStart,
  getTotalSensitiveFilesOnEndpointsStart,
} from './actions'
import {
  getEvidenceLockerInfoTask,
  getExfiltrationEventsTask,
  getNumberActiveDevicesTask,
  getNumberActiveUsersTask,
  getSensitiveFilesOnEndpointsTask,
  getTopEventsTask,
  getTotalSensitiveFilesOnEndpointsTask,
} from './selectors'
import type { DashboardState, TaskId } from './types'
import { DashboardReduxSlice } from './types'

const permissions = new Set([Permission.BIP_EVENT_READ])

export const queryTopEvents: ReduxQuery<
  DashboardTopEventsResponse,
  Parameters<typeof getTopEventsStart>[0],
  DashboardState['tasks'][TaskId.GetTopEvents]
> = {
  query: payload => getTopEventsStart(payload, DashboardDlpApi),
  mockQuery: payload => getTopEventsStart(payload, DashboardTopEventsMockApi),

  selector: () => getTopEventsTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions,
}

export const queryExfiltrationEvents: ReduxQuery<
  ExfiltrtationTypeEventsResponse,
  Parameters<typeof fetchExfiltrationEventsStart>[0],
  DashboardState['tasks'][TaskId.ExfiltrationTypeEvents]
> = {
  query: payload => fetchExfiltrationEventsStart(payload, DashboardDlpApi),
  mockQuery: payload => fetchExfiltrationEventsStart(payload, DashboardTopEventsMockApi),
  selector: () => getExfiltrationEventsTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions,
}

export const queryEvidenceLockerInfo: ReduxQuery<
  EvidenceLockerInfoResponse,
  Parameters<typeof getEvidenceLockerInfoStart>[0],
  DashboardState['tasks'][TaskId.EvidenceLockerInfo]
> = {
  query: () => getEvidenceLockerInfoStart(DashboardDlpApi),
  mockQuery: () => getEvidenceLockerInfoStart(DashboardTopEventsMockApi),
  selector: () => getEvidenceLockerInfoTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions,
}

export const queryTotalSensitiveFilesOnEndpoints: ReduxQuery<
  TotalSensitiveFilesOnEndpointsResponse,
  Parameters<typeof getTotalSensitiveFilesOnEndpointsStart>[0],
  DashboardState['tasks'][TaskId.GetTotalSensitiveFilesOnEndpoints]
> = {
  query: payload => getTotalSensitiveFilesOnEndpointsStart(DashboardDlpApi),
  mockQuery: payload => getTotalSensitiveFilesOnEndpointsStart(DashboardTopEventsMockApi),

  selector: () => getTotalSensitiveFilesOnEndpointsTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions,
}

export const querySensitiveFilesOnEndpoints: ReduxQuery<
  SensitiveFilesOnEndpointsResponse,
  Parameters<typeof getSensitiveFilesOnEndpointsStart>[0],
  DashboardState['tasks'][TaskId.GetSensitiveFilesOnEndpoints]
> = {
  query: payload => getSensitiveFilesOnEndpointsStart(payload, DashboardDlpApi),
  mockQuery: payload => getSensitiveFilesOnEndpointsStart(payload, DashboardTopEventsMockApi),

  selector: () => getSensitiveFilesOnEndpointsTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions,
}

export const queryNumberActiveUsers: ReduxQuery<
  ActiveUsersResponse,
  Parameters<typeof getNumberActiveUsersStart>[0],
  DashboardState['tasks'][TaskId.GetNumberActiveUsers]
> = {
  query: payload => getNumberActiveUsersStart(DashboardDlpApi),
  mockQuery: payload => getNumberActiveUsersStart(DashboardTopEventsMockApi),

  selector: () => getNumberActiveUsersTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions,
}

export const queryNumberActiveDevices: ReduxQuery<
  ActiveDevicesResponse,
  Parameters<typeof getNumberActiveDevicesStart>[0],
  DashboardState['tasks'][TaskId.GetNumberActiveDevices]
> = {
  query: payload => getNumberActiveDevicesStart(DashboardDlpApi),
  mockQuery: payload => getNumberActiveDevicesStart(DashboardTopEventsMockApi),

  selector: () => getNumberActiveDevicesTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions,
}
