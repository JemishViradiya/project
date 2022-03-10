import { createSelector } from 'reselect'

import type { DashboardState } from './types'
import { DashboardReduxSlice } from './types'

const getState = (state: { [k in typeof DashboardReduxSlice]: DashboardState }) => state[DashboardReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getAlertsTask = createSelector(getTasks, tasks => tasks?.alerts)

export const getAlertDetailsTask = createSelector(getTasks, tasks => tasks?.alertDetails)

export const getUserPersonaScoreLogTask = createSelector(getTasks, tasks => tasks?.userPersonaScoreLog)

export const getUserAlertsWithTrustScoreTask = createSelector(getTasks, tasks => tasks?.userAlertsWithTrustScore)

export const getScoresForSelectedAlertTask = createSelector(getTasks, tasks => tasks?.scoresForSelectedAlert)

export const getRelatedAlertsTask = createSelector(getTasks, tasks => tasks?.alertRelatedAlerts)

export const getAlertCommentsTask = createSelector(getTasks, tasks => tasks?.alertComments)

export const getAddAlertCommentTask = createSelector(getTasks, tasks => tasks?.addAlertComment)

export const getDeleteAlertCommentTask = createSelector(getTasks, tasks => tasks?.deleteAlertComment)

export const getTenantAlertCountsTask = createSelector(getTasks, tasks => tasks?.tenantAlertCounts)

export const getTenantOnlineDeviceCountsTask = createSelector(getTasks, tasks => tasks?.tenantOnlineDeviceCounts)

export const getTenantLowestTrustScoreUsersTask = createSelector(getTasks, tasks => tasks?.tenantLowestTrustScoreUsers)

export const getSearchUsersByUsernameDataTask = createSelector(getTasks, tasks => tasks?.searchUsersByUsernameData ?? {})

export const getSearchZoneByNameDataTask = createSelector(getTasks, tasks => tasks?.searchZonesByNameData ?? {})
