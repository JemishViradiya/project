import type { ReduxQuery } from '@ues-data/shared'

import type { AlertListResponse } from '..'
import { UsersApi } from '..'
import type { AlertCommentItem, AlertDetails } from '../alert-service'
import { AlertsApi, AlertsMockApi } from '../alert-service'
import type { StatisticsCountItem } from '../types'
import type { UserWithTrustScore } from '../user-service'
import { UsersMockApi } from '../user-service'
import {
  getAlertCommentsStart,
  getAlertDetailsStart,
  getAlertListStart,
  getRelatedAlertsStart,
  getTenantAlertCountsStart,
  getTenantLowestTrustScoreUsersStart,
  getTenantOnlineDeviceCountsStart,
} from './actions'
import {
  getAlertCommentsTask,
  getAlertDetailsTask,
  getAlertsTask,
  getRelatedAlertsTask,
  getTenantAlertCountsTask,
  getTenantLowestTrustScoreUsersTask,
  getTenantOnlineDeviceCountsTask,
} from './selectors'
import type { DashboardState, DashboardTaskId, TenantAlertCountsMap } from './types'
import { DashboardReduxSlice } from './types'

// TODO: Add proper Persona Dashboard permissions
const ReadPersonaDashboardPermissions = new Set([])

export const queryAlerts: ReduxQuery<
  AlertListResponse,
  Parameters<typeof getAlertListStart>[0],
  DashboardState['tasks'][DashboardTaskId.Alerts]
> = {
  query: payload => getAlertListStart(payload, AlertsApi),
  mockQuery: payload => getAlertListStart(payload, AlertsMockApi),
  selector: () => getAlertsTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions: ReadPersonaDashboardPermissions,
}

export const queryAlertDetails: ReduxQuery<
  AlertDetails,
  Parameters<typeof getAlertDetailsStart>[0],
  DashboardState['tasks'][DashboardTaskId.AlertDetails]
> = {
  query: payload => getAlertDetailsStart(payload, AlertsApi),
  mockQuery: payload => getAlertDetailsStart(payload, AlertsMockApi),
  selector: () => getAlertDetailsTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions: ReadPersonaDashboardPermissions,
}

export const queryRelatedAlerts: ReduxQuery<
  AlertListResponse,
  Parameters<typeof getRelatedAlertsStart>[0],
  DashboardState['tasks'][DashboardTaskId.AlertRelatedAlerts]
> = {
  query: payload => getRelatedAlertsStart(payload, AlertsApi),
  mockQuery: payload => getRelatedAlertsStart(payload, AlertsMockApi),
  selector: () => getRelatedAlertsTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions: ReadPersonaDashboardPermissions,
}

export const queryAlertComments: ReduxQuery<
  AlertCommentItem[],
  Parameters<typeof getAlertCommentsStart>[0],
  DashboardState['tasks'][DashboardTaskId.AlertComments]
> = {
  query: payload => getAlertCommentsStart(payload, AlertsApi),
  mockQuery: payload => getAlertCommentsStart(payload, AlertsMockApi),
  selector: () => getAlertCommentsTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions: ReadPersonaDashboardPermissions,
}

export const queryTenantAlertCounts: ReduxQuery<
  TenantAlertCountsMap,
  Parameters<typeof getTenantAlertCountsStart>[0],
  DashboardState['tasks'][DashboardTaskId.TenantAlertCounts]
> = {
  query: payload => getTenantAlertCountsStart(payload, AlertsApi),
  mockQuery: payload => getTenantAlertCountsStart(payload, AlertsMockApi),
  selector: () => getTenantAlertCountsTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions: ReadPersonaDashboardPermissions,
}

export const queryTenantOnlineDeviceCounts: ReduxQuery<
  StatisticsCountItem[],
  Parameters<typeof getTenantOnlineDeviceCountsStart>[0],
  DashboardState['tasks'][DashboardTaskId.TenantOnlineDeviceCounts]
> = {
  query: payload => getTenantOnlineDeviceCountsStart(payload, UsersApi),
  mockQuery: payload => getTenantOnlineDeviceCountsStart(payload, UsersMockApi),
  selector: () => getTenantOnlineDeviceCountsTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions: ReadPersonaDashboardPermissions,
}

export const queryTenantLowestTrustScoreUsers: ReduxQuery<
  UserWithTrustScore[],
  void,
  DashboardState['tasks'][DashboardTaskId.TenantLowestTrustScoreUsers]
> = {
  query: () => getTenantLowestTrustScoreUsersStart(UsersApi),
  mockQuery: () => getTenantLowestTrustScoreUsersStart(UsersMockApi),
  selector: () => getTenantLowestTrustScoreUsersTask,
  dataProp: 'result',
  slice: DashboardReduxSlice,
  permissions: ReadPersonaDashboardPermissions,
}
