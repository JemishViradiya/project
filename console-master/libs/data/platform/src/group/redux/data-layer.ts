/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { ReconciliationEntity, ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { FeatureName, FeaturizationApi, NoPermissions } from '@ues-data/shared'

import { Directory, DirectoryMock } from '../../directory'
import type { DirectoryGroup } from '../../directory/directory-types'
import { Reconciliation } from '../../reco/reco'
import { ReconciliationMock } from '../../reco/reco-mock'
import {
  DirectoryReadPermissions,
  UserCreatePermissions,
  UserDeletePermissions,
  UserReadPermissions,
  UserUpdatePermissions,
} from '../../shared/permissions'
import { Groups } from '../common/group'
import { GroupsMock } from '../common/group-mock'
import type { Group, PolicyTypeWithEntities } from '../common/group-types'
import {
  addUsersStart,
  assignProfilesStart,
  createGroupStart,
  deleteGroupsStart,
  getAssignableProfilesStart,
  getAssignedProfilesStart,
  getCurrentGroupStart,
  removeUsersStart,
  searchDirectoryGroupsStart,
  unassignProfileStart,
  updateGroupStart,
} from './actions'
import {
  getAddUsersTask,
  getAssignableProfilesTask,
  getAssignedProfilesTask,
  getAssignProfilesTask,
  getCreateGroupTask,
  getCurrentGroupTask,
  getDeleteGroupsTask,
  getDirectoryGroupsTask,
  getRemoveUsersTask,
  getUnassignProfileTask,
  getUpdateGroupTask,
} from './selectors'
import type { GroupsState, Task } from './types'
import { ReduxSlice } from './types'

export const isTaskResolved = (currentTask?: Task, previousTask?: Task): boolean =>
  previousTask && currentTask && previousTask.loading === true && currentTask.loading === false

export const mutationDeleteGroups: ReduxMutation<
  { ids: string[] },
  Parameters<typeof deleteGroupsStart>[0],
  GroupsState['tasks']['deleteGroups']
> = {
  mutation: payload => deleteGroupsStart(payload, Groups),
  mockMutation: payload => deleteGroupsStart(payload, GroupsMock),
  selector: () => getDeleteGroupsTask,
  slice: ReduxSlice,
  permissions: UserDeletePermissions,
}

export const mutationCreateGroup: ReduxMutation<
  Group,
  Parameters<typeof createGroupStart>[0],
  GroupsState['tasks']['createGroup']
> = {
  mutation: payload => createGroupStart(payload, Groups),
  mockMutation: payload => createGroupStart(payload, GroupsMock),
  selector: () => getCreateGroupTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: UserCreatePermissions,
}

export const mutationUpdateGroup: ReduxMutation<
  Group,
  Parameters<typeof updateGroupStart>[0],
  GroupsState['tasks']['updateGroup']
> = {
  mutation: payload => updateGroupStart(payload, Groups),
  mockMutation: payload => updateGroupStart(payload, GroupsMock),
  selector: () => getUpdateGroupTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: UserUpdatePermissions,
}

export const queryGroup: ReduxQuery<Group, Parameters<typeof getCurrentGroupStart>[0], ReturnType<typeof getCurrentGroupTask>> = {
  query: payload => getCurrentGroupStart(payload, Groups),
  mockQuery: payload => getCurrentGroupStart(payload, GroupsMock),
  selector: () => getCurrentGroupTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: UserReadPermissions,
}

export const queryAssignedPolicies: ReduxQuery<
  ReconciliationEntity[],
  Parameters<typeof getAssignedProfilesStart>[0],
  ReturnType<typeof getAssignedProfilesTask>
> = {
  query: payload => getAssignedProfilesStart(payload, Reconciliation),
  mockQuery: payload =>
    FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
      ? getAssignedProfilesStart(payload, Reconciliation)
      : getAssignedProfilesStart(payload, ReconciliationMock),
  selector: () => getAssignedProfilesTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: UserReadPermissions,
}

export const queryDirectoryGroups: ReduxQuery<
  DirectoryGroup[],
  Parameters<typeof searchDirectoryGroupsStart>[0],
  ReturnType<typeof getDirectoryGroupsTask>
> = {
  query: payload => searchDirectoryGroupsStart(payload, Directory),
  mockQuery: payload => searchDirectoryGroupsStart(payload, DirectoryMock),
  selector: () => getDirectoryGroupsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: DirectoryReadPermissions,
}

export const queryAssignableProfiles: ReduxQuery<
  PolicyTypeWithEntities[],
  Parameters<typeof getAssignableProfilesStart>[0],
  ReturnType<typeof getAssignableProfilesTask>
> = {
  query: payload => getAssignableProfilesStart(Reconciliation),
  mockQuery: payload => getAssignableProfilesStart(ReconciliationMock),
  selector: () => getAssignableProfilesTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: NoPermissions,
}

export const mutationAssignProfile: ReduxMutation<
  Group,
  Parameters<typeof assignProfilesStart>[0],
  GroupsState['tasks']['assignProfiles']
> = {
  mutation: payload => assignProfilesStart(payload, Groups),
  mockMutation: payload => assignProfilesStart(payload, GroupsMock),
  selector: () => getAssignProfilesTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: UserUpdatePermissions,
}

export const mutationUnassignProfile: ReduxMutation<
  Group,
  Parameters<typeof unassignProfileStart>[0],
  GroupsState['tasks']['unassignProfile']
> = {
  mutation: payload => unassignProfileStart(payload, Groups),
  mockMutation: payload => unassignProfileStart(payload, GroupsMock),
  selector: () => getUnassignProfileTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: UserUpdatePermissions,
}

export const mutationAddUsers: ReduxMutation<void, Parameters<typeof addUsersStart>[0], GroupsState['tasks']['addUsers']> = {
  mutation: payload => addUsersStart(payload, Groups),
  mockMutation: payload => addUsersStart(payload, GroupsMock),
  selector: () => getAddUsersTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: UserUpdatePermissions,
}

export const mutationRemoveUsers: ReduxMutation<
  void,
  Parameters<typeof removeUsersStart>[0],
  GroupsState['tasks']['removeUsers']
> = {
  mutation: payload => removeUsersStart(payload, Groups),
  mockMutation: payload => removeUsersStart(payload, GroupsMock),
  selector: () => getRemoveUsersTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: UserUpdatePermissions,
}
