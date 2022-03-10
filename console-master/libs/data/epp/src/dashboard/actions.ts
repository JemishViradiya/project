import type { ThreatEvents, ThreatsByPriority, ThreatStats, TopTenLists, TotalFilesAnalyzed } from '../dashboard-service'
import { EppDashboardAction } from './constants'
import type { ApiProvider } from './types'

// threat stats

const fetchThreatStatsStart = (apiProvider: ApiProvider) => ({
  type: EppDashboardAction.FetchThreatStatsStart,
  payload: { apiProvider },
})

const fetchThreatStatsSuccess = (payload: ThreatStats) => ({
  type: EppDashboardAction.FetchThreatStatsSuccess,
  payload,
})

const fetchThreatStatsError = (error: Error) => ({
  type: EppDashboardAction.FetchThreatStatsError,
  payload: { error },
})

// top ten lists

const fetchTopTenListStart = (apiProvider: ApiProvider) => ({
  type: EppDashboardAction.FetchTopTenListStart,
  payload: { apiProvider },
})

const fetchTopTenListSuccess = (payload: TopTenLists) => ({
  type: EppDashboardAction.FetchTopTenListSuccess,
  payload,
})

const fetchTopTenListError = (error: Error) => ({
  type: EppDashboardAction.FetchTopTenListError,
  payload: { error },
})

// total files analyzed

const fetchTotalFilesAnalyzedStart = (apiProvider: ApiProvider) => ({
  type: EppDashboardAction.FetchTotalFilesAnalyzedStart,
  payload: { apiProvider },
})

const fetchTotalFilesAnalyzedSuccess = (payload: TotalFilesAnalyzed) => ({
  type: EppDashboardAction.FetchTotalFilesAnalyzedSuccess,
  payload,
})

const fetchTotalFilesAnalyzedError = (error: Error) => ({
  type: EppDashboardAction.FetchTotalFilesAnalyzedError,
  payload: { error },
})

// threats by priority

const fetchThreatsByPriorityStart = (apiProvider: ApiProvider) => ({
  type: EppDashboardAction.FetchThreatsByPriorityStart,
  payload: { apiProvider },
})

const fetchThreatsByPrioritySuccess = (payload: ThreatsByPriority) => ({
  type: EppDashboardAction.FetchThreatsByPrioritySuccess,
  payload,
})

const fetchThreatsByPriorityError = (error: Error) => ({
  type: EppDashboardAction.FetchThreatsByPriorityError,
  payload: { error },
})

// threat protection

const fetchThreatProtectionPercentageStart = (apiProvider: ApiProvider) => ({
  type: EppDashboardAction.FetchThreatProtectionPercentageStart,
  payload: { apiProvider },
})

const fetchThreatProtectionPercentageSuccess = (payload: number) => ({
  type: EppDashboardAction.FetchThreatProtectionPercentageSuccess,
  payload,
})

const fetchThreatProtectionPercentageError = (error: Error) => ({
  type: EppDashboardAction.FetchThreatProtectionPercentageError,
  payload: { error },
})

// device protection

const fetchDeviceProtectionPercentageStart = (apiProvider: ApiProvider) => ({
  type: EppDashboardAction.FetchDeviceProtectionPercentageStart,
  payload: { apiProvider },
})

const fetchDeviceProtectionPercentageSuccess = (payload: number) => ({
  type: EppDashboardAction.FetchDeviceProtectionPercentageSuccess,
  payload,
})

const fetchDeviceProtectionPercentageError = (error: Error) => ({
  type: EppDashboardAction.FetchDeviceProtectionPercentageError,
  payload: { error },
})

const fetchThreatEventsStart = (apiProvider: ApiProvider) => ({
  type: EppDashboardAction.FetchThreatEventsStart,
  payload: { apiProvider },
})

const fetchThreatEventsSuccess = (payload: ThreatEvents[]) => ({
  type: EppDashboardAction.FetchThreatEventsSuccess,
  payload,
})

const fetchThreatEventsError = (error: Error) => ({
  type: EppDashboardAction.FetchThreatEventsError,
  payload: { error },
})

export {
  // threat stats
  fetchThreatStatsStart,
  fetchThreatStatsSuccess,
  fetchThreatStatsError,
  // total file analyzed
  fetchTotalFilesAnalyzedStart,
  fetchTotalFilesAnalyzedSuccess,
  fetchTotalFilesAnalyzedError,
  // threats by priority
  fetchThreatsByPriorityStart,
  fetchThreatsByPrioritySuccess,
  fetchThreatsByPriorityError,
  // threat protection
  fetchThreatProtectionPercentageStart,
  fetchThreatProtectionPercentageSuccess,
  fetchThreatProtectionPercentageError,
  // device protection
  fetchDeviceProtectionPercentageStart,
  fetchDeviceProtectionPercentageSuccess,
  fetchDeviceProtectionPercentageError,
  // top ten lists
  fetchTopTenListStart,
  fetchTopTenListSuccess,
  fetchTopTenListError,
  // threat events
  fetchThreatEventsStart,
  fetchThreatEventsSuccess,
  fetchThreatEventsError,
}
