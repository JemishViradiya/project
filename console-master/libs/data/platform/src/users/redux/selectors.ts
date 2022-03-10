/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { UsersState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: UsersState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getFetchUsersTask = createSelector(getTasks, tasks => tasks?.users)
