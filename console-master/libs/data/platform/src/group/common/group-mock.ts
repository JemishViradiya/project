//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type GroupsInterface from './group-interface'
import type { Group, GroupUser, ProfileGroupAssignment } from './group-types'

export const groupsMock: Group[] = [
  {
    id: 'e9a2b066-d37c-4890-94c0-7953e717e635',
    name: 'Default',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    dataSourceConnectionId: 'e9a2b066-d37c-4890-94c0-7953e617e635',
    isDirectoryGroup: true,
    isOnboardingEnabled: true,
    isNestingEnabled: false,
    relationships: {
      users: {
        count: 0,
      },
    },
  },
  {
    id: 'e9a2b066-d37c-4890-94c0-7953e717e636',
    name: 'All users',
    description: 'All company users',
    relationships: {
      users: {
        count: 7,
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
  {
    id: 'e9a2b066-d37c-4890-94c0-7953e717e63679',
    name: 'With network policy',
    description: '',
    relationships: {
      users: {
        count: 3,
      },
    },
  },
]

export const usersInGroupMock: PagableResponse<GroupUser> = {
  totals: {
    pages: 1,
    elements: 7,
  },
  count: 7,
  elements: [
    {
      id: '138c20ca-566b-40cb-a110-e93581462dd1',
      ecoId: '138c20ca-566b-40cb-a110-e93581462dd1',
      displayName: 'Pauly Thwaites',
      username: 'Pauly Thwaites',
      emailAddress: 'pthwaites0@blackhole.sw.rim.net',
    },
    {
      id: '138c20ca-566b-40cb-a110-e93581462dd2',
      ecoId: '138c20ca-566b-40cb-a110-e93581462dd2',
      displayName: 'Joleen Cardno',
      username: 'Joleen Cardno',
      emailAddress: 'jcardno1@blackhole.sw.rim.net',
    },
    {
      id: '138c20ca-566b-40cb-a110-e93581462dd3',
      ecoId: '138c20ca-566b-40cb-a110-e93581462dd2',
      displayName: 'Siana Reboulet',
      username: 'Siana Reboulet',
      emailAddress: 'sreboulet2@blackhole.sw.rim.net',
    },
    {
      id: '138c20ca-566b-40cb-a110-e93581462dd4',
      ecoId: '138c20ca-566b-40cb-a110-e93581462dd2',
      displayName: 'Timofei Borthram',
      username: 'Timofei Borthram',
      emailAddress: 'tborthram3@blackhole.sw.rim.net',
    },
    {
      id: '138c20ca-566b-40cb-a110-e93581462dd5',
      ecoId: '138c20ca-566b-40cb-a110-e93581462dd2',
      displayName: 'Gwen Turfs',
      username: 'Gwen Turfs',
      emailAddress: 'gturfs4@blackhole.sw.rim.net',
    },
    {
      id: '138c20ca-566b-40cb-a110-e93581462dd6',
      ecoId: '138c20ca-566b-40cb-a110-e93581462dd2',
      displayName: 'Jourdain Jeaneau',
      username: 'Jourdain Jeaneau',
      emailAddress: 'jjeaneau5@blackhole.sw.rim.net',
    },
    {
      id: '138c20ca-566b-40cb-a110-e93581462dd7',
      ecoId: '138c20ca-566b-40cb-a110-e93581462dd2',
      displayName: 'Rudolfo Woodes',
      username: 'Rudolfo Woodes',
      emailAddress: 'rwoodes6@blackhole.sw.rim.net',
    },
  ],
}

class GroupsClass implements GroupsInterface {
  getGroups(query?: string, sortBy?: string, offset?: number, max?: number): Response<PagableResponse<Group>> {
    if (query && query.includes('id=')) {
      const id = query.split('=')[1]
      const foundGroups = groupsMock.filter(g => g.id === id)
      return Promise.resolve({
        data: { totals: { elements: foundGroups.length, pages: 1 }, count: foundGroups.length, elements: foundGroups },
      })
    } else {
      return Promise.resolve({ data: { totals: { elements: 4, pages: 1 }, count: 4, elements: groupsMock } })
    }
  }
  update(group: Group): Response<Group> {
    return Promise.resolve({ data: group })
  }
  assignPolicies(groupId: string, assignments: ProfileGroupAssignment[]) {
    return Promise.resolve()
  }
  unassignPolicies(groupId: string, assignments: ProfileGroupAssignment[]) {
    return Promise.resolve()
  }
  create(group: Group): Response<Group> {
    return Promise.resolve({ data: group })
  }
  remove(id: string): Promise<void> {
    return Promise.resolve()
  }
  getGroupUsers(
    groupId: string,
    query?: string,
    sortBy?: string,
    offset?: number,
    max?: number,
  ): Response<PagableResponse<GroupUser>> {
    return Promise.resolve({ data: usersInGroupMock })
  }
  addUsers(groupId: string, users: GroupUser[]) {
    return Promise.resolve()
  }
  removeUsers(groupId: string, users: GroupUser[]) {
    return Promise.resolve()
  }
}

const GroupsMock = new GroupsClass()

export { GroupsMock }
