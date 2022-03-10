//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'
import { UesAxiosClient } from '@ues-data/shared'

import type { GroupResponse } from './connection-types'
import type GroupInterface from './group-interface'

const groupsUri = (type: string, query: string): string => `/platform/v1/emm/types/${type}/groups?query=${query}`

class GroupClass implements GroupInterface {
  getGroups(emmType: string, searchQuery: string): Response<GroupResponse> {
    return UesAxiosClient().get(groupsUri(emmType, encodeURIComponent(searchQuery)))
  }
}

const MDMGroup = new GroupClass()
export { MDMGroup }
