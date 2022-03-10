/* eslint-disable sonarjs/no-duplicate-string */
//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, ReconciliationEntityType } from '@ues-data/shared'

import { Action, getPolicyPermission } from '../shared/permissions'
import { bisDetectionProfilesMock, defaultProfilesMock } from './mock'

// Define the graph ql query for profile
const queryGetProfilesGql = gql`
  query GetProfiles($sortBy: String!, $query: String!, $cursor: String, $max: Int) {
    profiles(sortBy: $sortBy, query: $query, cursor: $cursor, max: $max) {
      __typename
      totals {
        __typename
        pages
        elements
      }
      count
      cursor
      hasMore
      elements {
        __typename
        serviceId
        entityType
        entityId
        name
        default
        description
        rank
        userCount
        groupCount
        created
        modified
      }
    }
  }
`

export interface ProfilesQueryVariables {
  sortBy: string
  query?: string
  cursor?: string
  max?: number
  entityType?: string
}

export const queryProfiles: ApolloQuery<any, ProfilesQueryVariables> = {
  mockQueryFn: ({ query }) => {
    const [, entityType] = query.split('=')

    return entityType === ReconciliationEntityType.BISDetectionPolicy ? bisDetectionProfilesMock : defaultProfilesMock
  },
  query: queryGetProfilesGql,
  context: getApolloQueryContext(APOLLO_DESTINATION.PLATFORM_BFF),
  permissions: (vars: ProfilesQueryVariables) => getPolicyPermission(Action.READ, vars.entityType as ReconciliationEntityType),
}
