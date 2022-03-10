//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import type { GroupResponse } from './connection-types'
import type GroupInterface from './group-interface'

export const GroupListMock = {
  pageHint: 'LTE5NDUxNDc0NDMjTDU4ODI5Mzg2',
  groups: [
    {
      id: '8c51e8fd-0beb-4943-a38f-c85e12b3871e',
      displayName: 'Test-Group1',
    },
    {
      id: 'a7e13edc-7355-4e5a-b3bc-42c24f9147ee',
      displayName: 'Test-Group2',
    },
  ],
}

class GroupClass implements GroupInterface {
  getGroups(emmType: string, searchQuery: string): Response<GroupResponse> {
    return Promise.resolve({ data: GroupListMock, status: 200 })
  }
}

const MDMGroupMock = new GroupClass()

export { MDMGroupMock }
