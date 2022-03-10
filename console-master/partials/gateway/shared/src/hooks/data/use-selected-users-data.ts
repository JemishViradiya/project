//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import { useMemo } from 'react'

import { gql } from '@apollo/client'

import type { User } from '@ues-data/platform'
import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, useStatefulApolloQuery } from '@ues-data/shared'
import type { PagableResponse } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'

type UseSelectedUsersDataFn = (userEcoIds: User['ecoId'][]) => { data: Record<User['ecoId'], User>; loading: boolean }

const queryUsersByEcoIds: ApolloQuery<{ selectedUsers: PagableResponse<User> }, { sortBy: string; input: User['ecoId'][] }> = {
  query: gql`
    query {
      selectedUsers(sortBy: $sortBy, input: $input)
        @rest(type: "SelectedUsers", path: "/platform/v1/users/query?sortBy={args.sortBy}", method: "POST") {
        navigation {
          next
          previous
        }
        totals {
          elements
          pages
        }
        count
        elements @type(name: "SelectedUser") {
          id
          ecoId
          username
          displayName
        }
      }
    }
  `,
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  permissions: new Set([Permission.ECS_USERS_READ]),
}

export const useSelectedUsersData: UseSelectedUsersDataFn = userEcoIds => {
  const { data, loading } = useStatefulApolloQuery(queryUsersByEcoIds, {
    variables: { sortBy: 'displayName asc', input: userEcoIds },
    skip: isEmpty(userEcoIds),
  })

  const usersMap = useMemo(() => data?.selectedUsers?.elements?.reduce((acc, item) => ({ ...acc, [item.ecoId]: item }), {}), [
    data?.selectedUsers?.elements,
  ])

  return { data: usersMap, loading }
}
