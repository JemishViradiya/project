//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import { UesAxiosClient } from '@ues-data/shared'
import type { PagableResponse, Response } from '@ues-data/shared-types'

import type GroupsInterface from './group-interface'
import type { Group, GroupUser, ProfileGroupAssignment } from './group-types'

class GroupsClass implements GroupsInterface {
  getGroups(query?: string, sortBy?: string, offset?: number, max?: number): Response<PagableResponse<Group>> {
    return UesAxiosClient().get(`/platform/v1/groups`, { params: { query, sortBy, offset, max } })
  }

  update(group: Group): Response<Group> {
    return UesAxiosClient().patch(`/platform/v1/groups/${group.id}`, group, {})
  }

  create(group: Group): Response<Group> {
    return UesAxiosClient().post('/platform/v1/groups', group, {})
  }

  remove(id: string): Promise<void> {
    return UesAxiosClient().delete(`/platform/v1/groups/${id}`, {})
  }

  assignPolicies(groupId: string, assignments: ProfileGroupAssignment[]) {
    return UesAxiosClient().post(`/platform/v1/reconciliation/assignments/groups/${groupId}`, assignments)
  }

  unassignPolicies(groupId: string, assignments: ProfileGroupAssignment[]) {
    return UesAxiosClient().delete(`/platform/v1/reconciliation/assignments/groups/${groupId}`, { data: assignments })
  }

  getGroupUsers(
    groupId: string,
    query?: string,
    sortBy?: string,
    offset?: number,
    max?: number,
  ): Response<PagableResponse<GroupUser>> {
    return UesAxiosClient().get(`/platform/v1/groups/${groupId}/users`, { params: { query, sortBy, offset, max } })
  }

  addUsers(groupId: string, users: GroupUser[]) {
    return UesAxiosClient().post(`/platform/v1/groups/${groupId}/users`, users)
  }

  removeUsers(groupId: string, users: GroupUser[]) {
    return UesAxiosClient().delete(`/platform/v1/groups/${groupId}/users`, { data: users })
  }
}

export const Groups = new GroupsClass()
