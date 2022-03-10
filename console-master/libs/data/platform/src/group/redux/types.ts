/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { ReconciliationEntity } from '@ues-data/shared'

import type { DirectoryGroup } from '../../directory/directory-types'
import type { Group, PolicyTypeWithEntities } from '../common/group-types'

export const ReduxSlice = 'app.platform.groups'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export interface GroupsState {
  tasks?: {
    deleteGroups: Task
    createGroup: Task
    updateGroup: Task
    currentGroup: Task<Group>
    searchDirectoryGroups: Task<DirectoryGroup[]>

    assignableProfiles: Task<PolicyTypeWithEntities[]>
    assignedProfiles: Task<ReconciliationEntity[]>
    assignProfiles: Task<ReconciliationEntity[]>
    unassignProfile: Task<ReconciliationEntity>

    addUsers: Task
    removeUsers: Task
  }
}

export const ActionType = {
  DeleteGroupsStart: `${ReduxSlice}/delete-groups-start`,
  DeleteGroupsError: `${ReduxSlice}/delete-groups-error`,
  DeleteGroupsSuccess: `${ReduxSlice}/delete-groups-success`,

  CreateGroupStart: `${ReduxSlice}/create-groups-start`,
  CreateGroupError: `${ReduxSlice}/create-groups-error`,
  CreateGroupSuccess: `${ReduxSlice}/create-groups-success`,

  UpdateGroupStart: `${ReduxSlice}/update-groups-start`,
  UpdateGroupError: `${ReduxSlice}/update-groups-error`,
  UpdateGroupSuccess: `${ReduxSlice}/update-groups-success`,

  GetCurrentGroupStart: `${ReduxSlice}/current-group-start`,
  GetCurrentGroupError: `${ReduxSlice}/current-group-error`,
  GetCurrentGroupSuccess: `${ReduxSlice}/current-group-success`,

  SearchDirectoryGroupsStart: `${ReduxSlice}/search-directory-groups-start`,
  SearchDirectoryGroupsError: `${ReduxSlice}/search-directory-groups-error`,
  SearchDirectoryGroupsSuccess: `${ReduxSlice}/search-directory-groups-success`,

  GetAssignableProfilesStart: `${ReduxSlice}/get-assignable-profiles-start`,
  GetAssignableProfilesError: `${ReduxSlice}/get-assignable-profiles-error`,
  GetAssignableProfilesSuccess: `${ReduxSlice}/get-assignable-profiles-success`,

  GetAssignedProfilesStart: `${ReduxSlice}/get-assigned-profiles-start`,
  GetAssignedProfilesError: `${ReduxSlice}/get-assigned-profiles-error`,
  GetAssignedProfilesSuccess: `${ReduxSlice}/get-assigned-profiles-success`,

  AssignProfilesStart: `${ReduxSlice}/assign-profiles-start`,
  AssignProfilesError: `${ReduxSlice}/assign-profiles-error`,
  AssignProfilesSuccess: `${ReduxSlice}/assign-profiles-success`,

  UnassignProfilesStart: `${ReduxSlice}/unassign-profiles-start`,
  UnassignProfilesError: `${ReduxSlice}/unassign-profiles-error`,
  UnassignProfilesSuccess: `${ReduxSlice}/unassign-profiles-success`,

  AddUsersStart: `${ReduxSlice}/add-users-start`,
  AddUsersError: `${ReduxSlice}/add-users-error`,
  AddUsersSuccess: `${ReduxSlice}/add-users-success`,

  RemoveUsersStart: `${ReduxSlice}/remove-users-start`,
  RemoveUsersError: `${ReduxSlice}/remove-users-error`,
  RemoveUsersSuccess: `${ReduxSlice}/remove-users-success`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
