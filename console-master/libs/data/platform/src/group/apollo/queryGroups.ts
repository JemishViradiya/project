import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import { UserReadPermissions } from '../../shared/permissions'
import { groupsMock } from '../common/group-mock'

// Define the graph ql query for groups
const queryGetGroupsGql = gql`
  query GetGroups($sortBy: String!, $query: String, $cursor: String, $max: Int) {
    userGroups(sortBy: $sortBy, query: $query, cursor: $cursor, max: $max) {
      totals {
        pages
        elements
      }
      count
      cursor
      elements {
        __typename
        id
        name
        description
        isOnboardingEnabled
        isNestingEnabled
        directoryLink
        dataSourceGroupId
        dataSourceConnectionId
        relationships {
          users {
            count
          }
        }
      }
    }
  }
`

export const groupFragment = gql`
  fragment UserGroupFragm on UserGroup {
    id
    name
    description
    isOnboardingEnabled
    isNestingEnabled
    dataSourceGroupId
    dataSourceConnectionId
  }
`

export interface GroupsQueryVariables {
  sortBy: string
  query?: string
  cursor?: string
  max?: number
}

const Mock = {
  userGroups: {
    totals: {
      pages: 1,
      elements: 4,
    },
    count: 4,
    elements: groupsMock,
  },
}

export const queryGroups: ApolloQuery<any, GroupsQueryVariables> = {
  mockQueryFn: () => Mock,
  query: queryGetGroupsGql,
  context: getApolloQueryContext(APOLLO_DESTINATION.PLATFORM_BFF),
  permissions: UserReadPermissions,
}
