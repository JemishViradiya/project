/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { CompanyDirectoryState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: CompanyDirectoryState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getCompanyDirectoriesTask = createSelector(getTasks, tasks => tasks?.companyDirectories)

export const getAddCompanyDirectoryTask = createSelector(getTasks, tasks => tasks?.addDirectory)

export const getRemoveCompanyDirectoryTask = createSelector(getTasks, tasks => tasks?.removeDirectory)

export const getEditCompanyDirectoryTask = createSelector(getTasks, tasks => tasks?.editDirectory)

export const getSyncDirectoryTask = createSelector(getTasks, tasks => tasks?.syncDirectory)

export const getCancelSyncDirectoryTask = createSelector(getTasks, tasks => tasks?.cancelSyncDirectory)
