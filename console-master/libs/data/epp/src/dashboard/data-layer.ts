import type { ReduxQuery } from '@ues-data/shared'
import { NoPermissions } from '@ues-data/shared'

import type { ThreatEvents, ThreatsByPriority, ThreatStats, TopTenLists, TotalFilesAnalyzed } from '../dashboard-service'
import { EppDashboardApi, EppDashboardMockApi } from '../dashboard-service'
import {
  fetchDeviceProtectionPercentageStart,
  fetchThreatEventsStart,
  fetchThreatProtectionPercentageStart,
  fetchThreatsByPriorityStart,
  fetchThreatStatsStart,
  fetchTopTenListStart,
  fetchTotalFilesAnalyzedStart,
} from './actions'
import type { TaskId } from './constants'
import { EppDashboardReduxSlice } from './constants'
import {
  selectDeviceProtectionPercentage,
  selectThreatEvents,
  selectThreatProtectionPercentage,
  selectThreatsByPriority,
  selectThreatStats,
  selectTopTenLists,
  selectTotalFilesAnalyzed,
} from './selectors'
import type { EppDashboardState } from './types'

const fetchThreatStats: ReduxQuery<
  ThreatStats,
  Parameters<typeof fetchThreatStatsStart>[0],
  EppDashboardState['tasks'][TaskId.ThreatStats]
> = {
  query: () => fetchThreatStatsStart(EppDashboardApi),
  mockQuery: () => fetchThreatStatsStart(EppDashboardMockApi),
  selector: () => selectThreatStats,
  slice: EppDashboardReduxSlice,
  permissions: NoPermissions,
}

const fetchTotalFilesAnalyzed: ReduxQuery<
  TotalFilesAnalyzed,
  Parameters<typeof fetchTotalFilesAnalyzedStart>[0],
  EppDashboardState['tasks'][TaskId.TotalFilesAnalyzed]
> = {
  query: () => fetchTotalFilesAnalyzedStart(EppDashboardApi),
  mockQuery: () => fetchTotalFilesAnalyzedStart(EppDashboardMockApi),
  selector: () => selectTotalFilesAnalyzed,
  slice: EppDashboardReduxSlice,
  permissions: NoPermissions,
}

const fetchThreatsByPriority: ReduxQuery<
  ThreatsByPriority,
  Parameters<typeof fetchThreatsByPriorityStart>[0],
  EppDashboardState['tasks'][TaskId.ThreatsByPriority]
> = {
  query: () => fetchThreatsByPriorityStart(EppDashboardApi),
  mockQuery: () => fetchThreatsByPriorityStart(EppDashboardMockApi),
  selector: () => selectThreatsByPriority,
  slice: EppDashboardReduxSlice,
  permissions: NoPermissions,
}

const fetchThreatProtectionPercentage: ReduxQuery<
  number,
  Parameters<typeof fetchThreatProtectionPercentageStart>[0],
  EppDashboardState['tasks'][TaskId.ThreatProtectionPercentage]
> = {
  query: () => fetchThreatProtectionPercentageStart(EppDashboardApi),
  mockQuery: () => fetchThreatProtectionPercentageStart(EppDashboardMockApi),
  selector: () => selectThreatProtectionPercentage,
  slice: EppDashboardReduxSlice,
  permissions: NoPermissions,
}

const fetchDeviceProtectionPercentage: ReduxQuery<
  number,
  Parameters<typeof fetchDeviceProtectionPercentageStart>[0],
  EppDashboardState['tasks'][TaskId.DeviceProtectionPercentage]
> = {
  query: () => fetchDeviceProtectionPercentageStart(EppDashboardApi),
  mockQuery: () => fetchDeviceProtectionPercentageStart(EppDashboardMockApi),
  selector: () => selectDeviceProtectionPercentage,
  slice: EppDashboardReduxSlice,
  permissions: NoPermissions,
}

const fetchTopTenLists: ReduxQuery<
  TopTenLists,
  Parameters<typeof fetchTopTenListStart>[0],
  EppDashboardState['tasks'][TaskId.TopTenLists]
> = {
  query: () => fetchTopTenListStart(EppDashboardApi),
  mockQuery: () => fetchTopTenListStart(EppDashboardMockApi),
  selector: () => selectTopTenLists,
  slice: EppDashboardReduxSlice,
  permissions: NoPermissions,
}

const fetchThreatEvents: ReduxQuery<
  ThreatEvents,
  Parameters<typeof fetchThreatEventsStart>[0],
  EppDashboardState['tasks'][TaskId.ThreatEvents]
> = {
  query: () => fetchThreatEventsStart(EppDashboardApi),
  mockQuery: () => fetchThreatEventsStart(EppDashboardMockApi),
  selector: () => selectThreatEvents,
  slice: EppDashboardReduxSlice,
  permissions: NoPermissions,
}

export {
  fetchThreatStats,
  fetchTotalFilesAnalyzed,
  fetchThreatsByPriority,
  fetchThreatEvents,
  fetchThreatProtectionPercentage,
  fetchDeviceProtectionPercentage,
  fetchTopTenLists,
}
