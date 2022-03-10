/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { UsersState } from './types'
import { UsersReduxSlice } from './types'

const getState = (state: { [k in typeof UsersReduxSlice]: UsersState }) => state[UsersReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getUsersTask = createSelector(getTasks, tasks => tasks?.getUsers)

export const getDevicesTask = createSelector(getTasks, tasks => tasks?.getDevices)
