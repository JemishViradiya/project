/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { AsyncMutation, AsyncQuery } from '@ues-data/shared'

import { Groups, GroupsMock } from '../../group/common'
import type { Group } from '../../group/common/group-types'
import { UserReadPermissions, UserUpdatePermissions } from '../../shared/permissions'
import { UsersGroups, UsersGroupsMock } from '../common'

export const queryUserGroups: AsyncQuery<Group[], { userId: string }> = {
  query: async ({ userId }) => {
    if (userId) {
      const data = await UsersGroups.getUserGroups(userId)
      return data.data
    } else {
      return undefined
    }
  },
  mockQueryFn: async ({ userId }) => {
    if (userId) {
      const data = await UsersGroupsMock.getUserGroups(userId)

      return data.data
    } else {
      return undefined
    }
  },
  permissions: UserReadPermissions,
}

export const queryNonUserGroups: AsyncQuery<Group[], { userId: string; search: string; assigned: Group[] }> = {
  query: async ({ userId, search, assigned }) => {
    if (userId) {
      const groups = await Groups.getGroups(`name=*${search}*`, 'name ASC', 0, 1000)
      const currentGroupIds = assigned.map(x => x.id)
      return groups.data.elements.filter(({ id, isDirectoryGroup }) => !currentGroupIds.includes(id) && !isDirectoryGroup)
    } else {
      return []
    }
  },
  mockQueryFn: async ({ userId, search, assigned }) => {
    if (userId && search) {
      const groups = await GroupsMock.getGroups(`name=*${search}*`, 'name ASC', 0, 1000)
      const currentGroupIds = assigned.map(x => x.id)
      return groups.data.elements.filter(({ id, isDirectoryGroup }) => !currentGroupIds.includes(id) && !isDirectoryGroup)
    } else {
      return []
    }
  },
  permissions: UserReadPermissions,
}

export const removeUserFromGroup: AsyncMutation<any, { userId: string; groupId: string }> = {
  mutation: async ({ userId, groupId }) => {
    await UsersGroups.removeUserFromGroup(userId, groupId)
  },
  mockMutationFn: async ({ userId, groupId }) => {
    await UsersGroupsMock.removeUserFromGroup(userId, groupId)
  },
  permissions: UserUpdatePermissions,
}

export const addUserToGroups: AsyncMutation<any, { userId: string; groups: Group[] }> = {
  mutation: async ({ userId, groups }) => {
    await UsersGroups.addUserToGroups(userId, groups)
  },
  mockMutationFn: async ({ userId, groups }) => {
    await UsersGroupsMock.addUserToGroups(userId, groups)
  },
  permissions: UserUpdatePermissions,
}

export const getNonDirectoryGroups: AsyncQuery<Group[]> = {
  query: async () => {
    const groups = await Groups.getGroups(undefined, 'name ASC', 0, 1000)
    return groups.data.elements.filter(({ isDirectoryGroup }) => !isDirectoryGroup)
  },
  mockQueryFn: async () => {
    const groups = await GroupsMock.getGroups(undefined, 'name ASC', 0, 1000)
    return groups.data.elements.filter(({ isDirectoryGroup }) => !isDirectoryGroup)
  },
  permissions: UserReadPermissions,
}
