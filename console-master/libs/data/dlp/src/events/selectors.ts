/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { DlpEventsState } from './types'
import { DlpEventsReduxSlice } from './types'

const getState = (state: { [k in typeof DlpEventsReduxSlice]: DlpEventsState }) => state[DlpEventsReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getDlpEventsTask = createSelector(getTasks, tasks => tasks?.getEvents)
export const getDlpEventDetailsTask = createSelector(getTasks, tasks => tasks?.getEventDetails)
