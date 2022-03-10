//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import { useMemo } from 'react'

import type { Group } from '@ues-data/platform'
import { GroupsApi } from '@ues-data/platform'
import { useStatefulApolloQuery } from '@ues-data/shared'

import { encodeIdQueryValues } from './utils'

type UseSelectedGroupsDataFn = (groupIds: string[]) => { data: Record<string, Group>; loading: boolean }

export const useSelectedGroupsData: UseSelectedGroupsDataFn = groupIds => {
  const { data, loading } = useStatefulApolloQuery(GroupsApi.queryGroups, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    skip: isEmpty(groupIds),
    variables: { sortBy: 'name asc', query: encodeIdQueryValues(groupIds) },
  })

  const groupsMap = useMemo(() => data?.userGroups?.elements?.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}), [
    data?.userGroups?.elements,
  ])

  return { data: groupsMap, loading }
}
