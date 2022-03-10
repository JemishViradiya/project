import { createSelector } from 'reselect'

import { EppDashboardReduxSlice } from './constants'
import type { EppDashboardState } from './types'

const getState = (state: { [k in typeof EppDashboardReduxSlice]: EppDashboardState }) => state[EppDashboardReduxSlice]
const getTasks = createSelector(getState, state => state?.tasks)

const selectThreatStats = createSelector(getTasks, tasks => tasks?.threatStats)
const selectTotalFilesAnalyzed = createSelector(getTasks, tasks => tasks?.totalFilesAnalyzed)
const selectThreatsByPriority = createSelector(getTasks, tasks => tasks?.threatsByPriority)
const selectThreatProtectionPercentage = createSelector(getTasks, tasks => tasks?.threatProtectionPercentage)
const selectDeviceProtectionPercentage = createSelector(getTasks, tasks => tasks?.deviceProtectionPercentage)
const selectTopTenLists = createSelector(getTasks, tasks => tasks?.topTenLists)
const selectThreatEvents = createSelector(getTasks, tasks => tasks?.threatEvents)

export {
  selectThreatStats,
  selectTotalFilesAnalyzed,
  selectThreatsByPriority,
  selectThreatEvents,
  selectThreatProtectionPercentage,
  selectDeviceProtectionPercentage,
  selectTopTenLists,
}
