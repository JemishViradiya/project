//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import type { Response } from '@ues-data/shared'
import { UesAxiosClient } from '@ues-data/shared'

import type { Group } from '../../group'
import type UsersGroupInterface from './users-groups-interface'

class UsersGroupsClass implements UsersGroupInterface {
  getUserGroups(userId: string): Response<Group[]> {
    return UesAxiosClient().get(`/platform/v1/users/${userId}/groups`)
  }
  addUserToGroups(userId: string, groups: Group[]): Promise<void> {
    return UesAxiosClient().post(`/platform/v1/users/${userId}/groups`, groups)
  }
  removeUserFromGroup(userId: string, groupId: string): Promise<void> {
    return UesAxiosClient().delete(`/platform/v1/users/${userId}/groups/${groupId}`)
  }
}

export const UsersGroups = new UsersGroupsClass()
