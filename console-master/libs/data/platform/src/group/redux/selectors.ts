/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { GroupsState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: GroupsState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getDeleteGroupsTask = createSelector(getTasks, tasks => tasks?.deleteGroups)

export const getCreateGroupTask = createSelector(getTasks, tasks => tasks?.createGroup)

export const getUpdateGroupTask = createSelector(getTasks, tasks => tasks?.updateGroup)

export const getCurrentGroupTask = createSelector(getTasks, tasks => tasks?.currentGroup)

export const getDirectoryGroupsTask = createSelector(getTasks, tasks => tasks?.searchDirectoryGroups)

export const getAssignableProfilesTask = createSelector(getTasks, tasks => tasks?.assignableProfiles)

export const getAssignedProfilesTask = createSelector(getTasks, tasks => tasks?.assignedProfiles)

export const getAssignProfilesTask = createSelector(getTasks, tasks => tasks?.assignProfiles)

export const getUnassignProfileTask = createSelector(getTasks, tasks => tasks?.unassignProfile)

export const getAddUsersTask = createSelector(getTasks, tasks => tasks?.addUsers)

export const getRemoveUsersTask = createSelector(getTasks, tasks => tasks?.removeUsers)
