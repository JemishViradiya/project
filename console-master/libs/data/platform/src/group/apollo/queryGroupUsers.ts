import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import { UserReadPermissions } from '../../shared/permissions'
import { usersInGroupMock } from '../common/group-mock'

const queryGetGroupUsersGql = gql`
  query GetGroupUsers($id: String!, $sortBy: String, $query: String, $offset: Int, $max: Int) {
    usersInGroup(id: $id, sortBy: $sortBy, query: $query, offset: $offset, max: $max)
      @rest(
        path: "/platform/v1/groups/{args.id}/users?max={args.max}&query={args.query}&sortBy={args.sortBy}&offset={args.offset}"
        method: "GET"
      ) {
      totals {
        pages
        elements
      }
      navigation {
        next
        previous
      }
      count
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
  sortBy?: string
  query?: string
  offset?: number
  max?: number
}

const Mock = {
  usersInGroup: usersInGroupMock,
}

export const queryGroupUsers: ApolloQuery<any, QueryVariables> = {
  mockQueryFn: () => Mock,
  query: queryGetGroupUsersGql,
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  permissions: UserReadPermissions,
}
