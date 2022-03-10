//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useMemo } from 'react'

import type { AclRule } from '@ues-data/gateway'
import { AclRuleSelectorProperty } from '@ues-data/gateway'
import { Hooks } from '@ues-gateway/shared'

const { useSelectedUsersData, useSelectedGroupsData } = Hooks

type UseRuleUsersAndGroupsDataFn = (
  initialConditions: AclRule['criteria']['selector']['conjunctions'],
) => { usersTask: ReturnType<typeof useSelectedUsersData>; groupsTask: ReturnType<typeof useSelectedGroupsData> }

export const useRuleUsersAndGroupsData: UseRuleUsersAndGroupsDataFn = initialConditions => {
  const { assignedUserIds, assignedGroupIds } = useMemo(
    () =>
      (initialConditions ?? []).reduce(
        (mainAcc, item) => {
          const { usersIds, groupIds } = item.reduce(
            (nestedAcc, item) => ({
              usersIds:
                item.propertySelector.property === AclRuleSelectorProperty.User
                  ? [...nestedAcc.usersIds, ...item.propertySelector.values]
                  : nestedAcc.usersIds,
              groupIds:
                item.propertySelector.property === AclRuleSelectorProperty.UserGroup
                  ? [...nestedAcc.groupIds, ...item.propertySelector.values]
                  : nestedAcc.groupIds,
            }),
            { usersIds: [], groupIds: [] },
          )

          return {
            assignedUserIds: [...mainAcc.assignedUserIds, ...usersIds],
            assignedGroupIds: [...mainAcc.assignedGroupIds, ...groupIds],
          }
        },
        { assignedUserIds: [], assignedGroupIds: [] },
      ),
    [initialConditions],
  )

  const usersTask = useSelectedUsersData(assignedUserIds)
  const groupsTask = useSelectedGroupsData(assignedGroupIds)

  return { usersTask, groupsTask }
}
