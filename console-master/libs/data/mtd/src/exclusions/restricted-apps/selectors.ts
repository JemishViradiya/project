/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { RestrictedAppsState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: RestrictedAppsState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getRestrictedApps = createSelector(getTasks, tasks => tasks?.restrictedApps?.result?.elements ?? [])

export const getRestrictedAppsTask = createSelector(getTasks, tasks => tasks?.restrictedApps)

export const getCreateRestrictedAppTask = createSelector(getTasks, tasks => tasks?.createRestrictedApp)

export const getImportRestrictedAppTask = createSelector(getTasks, tasks => tasks?.importRestrictedApps)

export const getEditRestrictedAppTask = createSelector(getTasks, tasks => tasks?.editRestrictedApp)

export const getDeleteRestrictedAppsTask = createSelector(getTasks, tasks => tasks?.deleteRestrictedApps)
