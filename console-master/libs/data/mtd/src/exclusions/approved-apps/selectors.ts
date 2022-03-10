/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { ApprovedAppsState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: ApprovedAppsState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getApprovedApps = createSelector(getTasks, tasks => tasks?.approvedApps?.result?.elements ?? [])

export const getApprovedAppsTask = createSelector(getTasks, tasks => tasks?.approvedApps)

export const getCreateApprovedAppTask = createSelector(getTasks, tasks => tasks?.createApprovedApp)

export const getImportApprovedAppsTask = createSelector(getTasks, tasks => tasks?.importApprovedApps)

export const getEditApprovedAppTask = createSelector(getTasks, tasks => tasks?.editApprovedApp)

export const getDeleteApprovedAppsTask = createSelector(getTasks, tasks => tasks?.deleteApprovedApps)
