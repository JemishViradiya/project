const EppDashboardReduxSlice = 'app.epp.dashboard'

const EppDashboardAction = {
  FetchThreatStatsStart: `${EppDashboardReduxSlice}/fetch-threat-stats-start`,
  FetchThreatStatsSuccess: `${EppDashboardReduxSlice}/fetch-threat-stats-success`,
  FetchThreatStatsError: `${EppDashboardReduxSlice}/fetch-threat-stats-error`,
  FetchTotalFilesAnalyzedStart: `${EppDashboardReduxSlice}/fetch-total-files-analyzed-start`,
  FetchTotalFilesAnalyzedSuccess: `${EppDashboardReduxSlice}/fetch-total-files-analyzed-success`,
  FetchTotalFilesAnalyzedError: `${EppDashboardReduxSlice}/fetch-total-files-analyzed-error`,
  FetchThreatsByPriorityStart: `${EppDashboardReduxSlice}/fetch-threat-by-priority-start`,
  FetchThreatsByPrioritySuccess: `${EppDashboardReduxSlice}/fetch-threat-by-priority-success`,
  FetchThreatsByPriorityError: `${EppDashboardReduxSlice}/fetch-threat-by-priority-error`,
  FetchThreatProtectionPercentageStart: `${EppDashboardReduxSlice}/fetch-threat-protection-percentage-start`,
  FetchThreatProtectionPercentageSuccess: `${EppDashboardReduxSlice}/fetch-threat-protection-percentage-success`,
  FetchThreatProtectionPercentageError: `${EppDashboardReduxSlice}/fetch-threat-protection-percentage-error`,
  FetchDeviceProtectionPercentageStart: `${EppDashboardReduxSlice}/fetch-device-protection-percentage-start`,
  FetchDeviceProtectionPercentageSuccess: `${EppDashboardReduxSlice}/fetch-device-protection-percentage-success`,
  FetchDeviceProtectionPercentageError: `${EppDashboardReduxSlice}/fetch-device-protection-percentage-error`,
  FetchTopTenListStart: `${EppDashboardReduxSlice}/fetch-top-ten-list-start`,
  FetchTopTenListSuccess: `${EppDashboardReduxSlice}/fetch-top-ten-list-success`,
  FetchTopTenListError: `${EppDashboardReduxSlice}/fetch-top-ten-list-error`,
  FetchThreatEventsStart: `${EppDashboardReduxSlice}/fetch-threat-events-start`,
  FetchThreatEventsSuccess: `${EppDashboardReduxSlice}/fetch-threat-events-success`,
  FetchThreatEventsError: `${EppDashboardReduxSlice}/fetch-threat-events-error`,
}

enum TaskId {
  ThreatStats = 'threatStats',
  TotalFilesAnalyzed = 'totalFilesAnalyzed',
  ThreatsByPriority = 'threatsByPriority',
  ThreatProtectionPercentage = 'threatProtectionPercentage',
  DeviceProtectionPercentage = 'deviceProtectionPercentage',
  TopTenLists = 'topTenLists',
  ThreatEvents = 'threatEvents',
}

export { EppDashboardReduxSlice, EppDashboardAction, TaskId }
