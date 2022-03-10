/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { ReconciliationEntity } from '@ues-data/shared'

import type DirectoryInterface from '../../directory/directory-interface'
import type { DirectoryGroup } from '../../directory/directory-types'
import type RecoInterface from '../../reco/reco-interface'
import type GroupsInterface from '../common/group-interface'
import type { Group, GroupUser, PolicyTypeWithEntities } from '../common/group-types'
import { ActionType } from './types'

export const deleteGroupsStart = (payload: { ids: string[] }, apiProvider: GroupsInterface) => ({
  type: ActionType.DeleteGroupsStart,
  payload: { ...payload, apiProvider },
})

export const deleteGroupsSuccess = () => ({
  type: ActionType.DeleteGroupsSuccess,
})

export const deleteGroupsError = (error: Error) => ({
  type: ActionType.DeleteGroupsError,
  payload: { error },
})

export const createGroupStart = (payload: Group, apiProvider: GroupsInterface) => ({
  type: ActionType.CreateGroupStart,
  payload: { group: payload, apiProvider },
})

export const createGroupSuccess = (payload: Group) => ({
  type: ActionType.CreateGroupSuccess,
  payload: { group: payload },
})

export const createGroupError = (error: Error) => ({
  type: ActionType.CreateGroupError,
  payload: { error },
})

export const updateGroupStart = (payload: Group, apiProvider: GroupsInterface) => ({
  type: ActionType.UpdateGroupStart,
  payload: { group: payload, apiProvider },
})

export const updateGroupSuccess = (payload: Group) => ({
  type: ActionType.UpdateGroupSuccess,
  payload: { group: payload },
})

export const updateGroupError = (error: Error) => ({
  type: ActionType.UpdateGroupError,
  payload: { error },
})

export const getCurrentGroupStart = (payload: string, apiProvider: GroupsInterface) => ({
  type: ActionType.GetCurrentGroupStart,
  payload: { id: payload, apiProvider },
})

export const getCurrentGroupSuccess = (payload: Group) => ({
  type: ActionType.GetCurrentGroupSuccess,
  payload: { group: payload },
})

export const getCurrentGroupError = (error: Error) => ({
  type: ActionType.GetCurrentGroupError,
  payload: { error },
})

export const searchDirectoryGroupsStart = (payload: string, apiProvider: DirectoryInterface) => ({
  type: ActionType.SearchDirectoryGroupsStart,
  payload: { search: payload, apiProvider },
})

export const searchDirectoryGroupsSuccess = (payload: DirectoryGroup[]) => ({
  type: ActionType.SearchDirectoryGroupsSuccess,
  payload: { directoryGroups: payload },
})

export const searchDirectoryGroupsError = (error: Error) => ({
  type: ActionType.SearchDirectoryGroupsError,
  payload: { error },
})

export const getAssignableProfilesStart = (apiProvider: RecoInterface) => ({
  type: ActionType.GetAssignableProfilesStart,
  payload: { apiProvider },
})

export const getAssignableProfilesSuccess = (payload: PolicyTypeWithEntities[]) => ({
  type: ActionType.GetAssignableProfilesSuccess,
  payload: { profiles: payload },
})

export const getAssignableProfilesError = (error: Error) => ({
  type: ActionType.GetAssignableProfilesError,
  payload: { error },
})

export const getAssignedProfilesStart = (payload: { id: string; local: boolean }, apiProvider: RecoInterface) => ({
  type: ActionType.GetAssignedProfilesStart,
  payload: { ...payload, apiProvider },
})

export const getAssignedProfilesSuccess = (payload: ReconciliationEntity[]) => ({
  type: ActionType.GetAssignedProfilesSuccess,
  payload: { profiles: payload },
})

export const getAssignedProfilesError = (error: Error) => ({
  type: ActionType.GetAssignedProfilesError,
  payload: { error },
})

export const assignProfilesStart = (
  payload: { profiles: ReconciliationEntity[]; reconciliationType: string; local: boolean; id: string },
  apiProvider: GroupsInterface,
) => ({
  type: ActionType.AssignProfilesStart,
  payload: { ...payload, apiProvider },
})

export const assignProfilesSuccess = (payload: { profiles: ReconciliationEntity[]; reconciliationType: string }) => ({
  type: ActionType.AssignProfilesSuccess,
  payload: { ...payload },
})

export const assignProfilesError = (error: Error) => ({
  type: ActionType.AssignProfilesError,
  payload: { error },
})

export const unassignProfileStart = (
  payload: { profile: ReconciliationEntity; local: boolean; id: string },
  apiProvider: GroupsInterface,
) => ({
  type: ActionType.UnassignProfilesStart,
  payload: { ...payload, apiProvider },
})

export const unassignProfilesSuccess = (payload: ReconciliationEntity) => ({
  type: ActionType.UnassignProfilesSuccess,
  payload: { profile: payload },
})

export const unassignProfilesError = (error: Error) => ({
  type: ActionType.UnassignProfilesError,
  payload: { error },
})

export const addUsersStart = (payload: { id: string; users: GroupUser[] }, apiProvider: GroupsInterface) => ({
  type: ActionType.AddUsersStart,
  payload: { ...payload, apiProvider },
})

export const addUsersSuccess = (payload: GroupUser[]) => ({
  type: ActionType.AddUsersSuccess,
  payload: { users: payload },
})

export const addUsersError = (error: Error) => ({
  type: ActionType.AddUsersError,
  payload: { error },
})

export const removeUsersStart = (payload: { id: string; users: GroupUser[] }, apiProvider: GroupsInterface) => ({
  type: ActionType.RemoveUsersStart,
  payload: { ...payload, apiProvider },
})

export const removeUsersSuccess = (payload: GroupUser[]) => ({
  type: ActionType.RemoveUsersSuccess,
  payload: { users: payload },
})

export const removeUsersError = (error: Error) => ({
  type: ActionType.RemoveUsersError,
  payload: { error },
})
