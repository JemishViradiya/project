/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { DashboardState } from './types'
import { DashboardReduxSlice } from './types'

const getState = (state: { [k in typeof DashboardReduxSlice]: DashboardState }) => state[DashboardReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getTopEventsTask = createSelector(getTasks, tasks => tasks?.getTopEvents)

export const getExfiltrationEventsTask = createSelector(getTasks, tasks => tasks?.exfiltrationTypeEvents)

export const getEvidenceLockerInfoTask = createSelector(getTasks, tasks => tasks?.evidenceLockerInfo)

export const getTotalSensitiveFilesOnEndpointsTask = createSelector(getTasks, tasks => tasks?.getTotalSensitiveFilesOnEndpoints)

export const getSensitiveFilesOnEndpointsTask = createSelector(getTasks, tasks => tasks?.getSensitiveFilesOnEndpoints)

export const getNumberActiveUsersTask = createSelector(getTasks, tasks => tasks?.getNumberActiveUsers)

export const getNumberActiveDevicesTask = createSelector(getTasks, tasks => tasks?.getNumberActiveDevices)
