/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { BcnState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: BcnState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getConnectionsTask = createSelector(getTasks, tasks => tasks?.bcnInstances)

export const getDeleteConnectionTask = createSelector(getTasks, tasks => tasks?.deleteInstance)

export const getBcnSettingsTask = createSelector(getTasks, tasks => tasks?.bcnSettings)

export const getBcnSettings = createSelector(getTasks, tasks => tasks?.bcnSettings?.result ?? {})
