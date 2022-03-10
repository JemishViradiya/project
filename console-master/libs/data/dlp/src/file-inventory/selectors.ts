/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { FileInventoryState } from './types'
import { FileInventoryReduxSlice } from './types'

const getState = (state: { [k in typeof FileInventoryReduxSlice]: FileInventoryState }) => state[FileInventoryReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getFileInventoryTask = createSelector(getTasks, tasks => tasks?.getFileInventory)
export const getFileDetailsTask = createSelector(getTasks, tasks => tasks?.getFileDetails)
