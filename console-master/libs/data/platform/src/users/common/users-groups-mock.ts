//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared'

import type { Group } from '../../group'
import type UsersGroupInterface from './users-groups-interface'

export const groupsMock: Group[] = [
  {
    id: 'e9a2b066-d37c-4890-94c0-7953e717e636',
    name: 'All users',
    relationships: {
      users: {
        count: 0,
      },
    },
  },
  {
    id: '413aaf5b-7460-48a9-9e5b-eea681ee0563',
    name: 'With enrollment policy',
    description: 'Lorem Ipsum is simply dummy text',
    relationships: {
      users: {
        count: 4,
      },
    },
  },
]

class UsersGroupsClass implements UsersGroupInterface {
  getUserGroups(userId: string): Response<Group[]> {
    return Promise.resolve({ data: groupsMock })
  }
  addUserToGroups(userId: string, groups: Group[]): Promise<void> {
    return Promise.resolve()
  }
  removeUserFromGroup(userId: string, groupId: string): Promise<void> {
    return Promise.resolve()
  }
}

const UsersGroupsMock = new UsersGroupsClass()

export { UsersGroupsMock }
