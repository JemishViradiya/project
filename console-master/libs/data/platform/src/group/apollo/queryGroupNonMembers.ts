//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import { UserReadPermissions } from '../../shared/permissions'
import { usersMock } from '../../users/common/users-mock'

// Define the graph ql query for profile non members
const queryGetGroupNonMembersGql = gql`
  query GetProfileNonMembers($id: String!, $searchTerm: String!) {
    groupNonMembers(id: $id, searchTerm: $searchTerm)
      @rest(
        path: "/platform/v1/groups/{args.id}/users?showOnlyEligible=true&query=displayName={args.searchTerm},isAdminOnly=false&sortBy=displayName ASC&max=25"
        method: "GET"
      ) {
      elements {
        id
        ecoId
        username
        firstName
        lastName
        displayName
        emailAddress
        dataSource
        dataSourceConnectionId
        dataSourceUserId
        title
        department
        company
        alias
        homePhoneNumber
        mobilePhoneNumber
        companyPhoneNumber
        street
        poBox
        city
        state
        postalCode
        country
        domain
        adSid
        tenantId
      }
    }
  }
`

interface QueryVariables {
  id: string
  searchTerm: string
}

const Mock = {
  groupNonMembers: { elements: usersMock.elements },
}

export const queryGroupNonMembers: ApolloQuery<any, QueryVariables> = {
  mockQueryFn: () => Mock,
  query: queryGetGroupNonMembersGql,
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  permissions: UserReadPermissions,
}
