//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

import type { ApolloQuery, ReconciliationEntityType } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import { Action, getPolicyPermission } from '../shared/permissions'
import { profileMembersMock } from './mock'

// Define the graph ql query for profile members
const queryGetProfileMembersGql = gql`
  query GetProfileMembers(
    $serviceId: String!
    $entityType: String!
    $entityId: String!
    $cursor: String
    $max: Int
    $sortDirection: String
  ) {
    profileMembers(
      serviceId: $serviceId
      entityType: $entityType
      entityId: $entityId
      cursor: $cursor
      max: $max
      sortDirection: $sortDirection
    ) {
      __typename
      elements {
        ... on User {
          __typename
          id
          firstName
          lastName
          displayName
          emailAddress
          displayName
        }
        ... on Group {
          __typename
          id
          name
          relationships {
            __typename
            users {
              __typename
              count
            }
          }
        }
      }
      cursor
      hasMore
      count {
        total
      }
    }
  }
`

export interface ProfileMembersQueryVariables {
  serviceId: string
  entityType: string
  entityId: string
  cursor?: string
  max?: number
  sortDirection?: string
}

export const queryProfileMembers: ApolloQuery<any, ProfileMembersQueryVariables> = {
  mockQueryFn: () => profileMembersMock,
  query: queryGetProfileMembersGql,
  context: getApolloQueryContext(APOLLO_DESTINATION.PLATFORM_BFF),
  permissions: (vars: ProfileMembersQueryVariables) =>
    getPolicyPermission(Action.READ, vars.entityType as ReconciliationEntityType),
}
