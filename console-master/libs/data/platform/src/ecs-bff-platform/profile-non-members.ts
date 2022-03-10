//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

import type { ApolloQuery, ReconciliationEntityType } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import { Action, getPolicyPermission } from '../shared/permissions'

// Define the graph ql query for profile non members
const queryGetProfileNonMembersGql = gql`
  query GetProfileNonMembers($serviceId: String!, $entityType: String!, $entityId: String!, $searchTerm: String!) {
    profileNonMembers(serviceId: $serviceId, entityType: $entityType, entityId: $entityId, searchTerm: $searchTerm) {
      __typename
      elements {
        ... on User {
          __typename
          id
          firstName
          lastName
          displayName
          disabled
          emailAddress
          displayName
        }
        ... on Group {
          __typename
          id
          name
          disabled
          relationships {
            __typename
            users {
              __typename
              count
            }
          }
        }
      }
    }
  }
`

export interface ProfileNonMembersQueryVariables {
  serviceId: string
  entityType: string
  entityId: string
  searchTerm: string
}

// Sample payload returned for getProfilesNonMember query
const profileNonMembersMock = JSON.parse(
  '{"profileNonMembers":{"__typename":"profileNonMembersResponse","elements":[{"__typename":"Group","id":"134e3060-f0a6-4123-8d87-6c5aab1c8c73","name":"David Group","disabled":true,"relationships":{"__typename":"Relationships","users":{"__typename":"UsersRelationship","count":0}}},{"__typename":"User","id":"QW85Unl3SkRoR2Q0bnpvV3ZhbXFwa3MzMzM=", "displayName":"David User", "firstName":"David","lastName":"User","disabled":false},{"__typename":"Group","id":"13c32c24-53b8-4d00-866e-16bea07cdec4","name":"David2 Group","disabled":true,"relationships":{"__typename":"Relationships","users":{"__typename":"UsersRelationship","count":0}}},{"__typename":"User","id":"QW85Unl3SkRoR2Q0bnpvV3ZhbXFwa3MyMg==", "displayName": "David2 User", "firstName":"David2","lastName":"User","disabled":true},{"__typename":"Group","id":"2c0cfdce-a5c1-49a1-94a9-008e5b0f83a3","name":"David3 Group","disabled":true,"relationships":{"__typename":"Relationships","users":{"__typename":"UsersRelationship","count":0}}},{"__typename":"User","id":"QW85Unl3SkRoR2Q0bnpvV3ZhbXFwa3M0NDQ=", "displayName":"David3 User", "firstName":"David3","lastName":"User","disabled":true}]}}',
)

export const queryProfileNonMembers: ApolloQuery<any, ProfileNonMembersQueryVariables> = {
  mockQueryFn: () => profileNonMembersMock,
  query: queryGetProfileNonMembersGql,
  context: getApolloQueryContext(APOLLO_DESTINATION.PLATFORM_BFF),
  permissions: (vars: ProfileNonMembersQueryVariables) =>
    getPolicyPermission(Action.READ, vars.entityType as ReconciliationEntityType),
}
