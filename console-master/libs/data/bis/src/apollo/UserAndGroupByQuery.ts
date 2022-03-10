import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { UserAndGroupByQueryMock } from './mocks'

export const UserAndGroupByQuery: ApolloQuery<typeof UserAndGroupByQueryMock, { query: string }> = {
  displayName: 'UserAndGroupByQuery',
  query: gql`
    query usersByName($query: String!) {
      directoryByName: BIS_directoryByName(query: $query) {
        users {
          id
          info {
            displayName
            primaryEmail
            username
          }
          __typename
        }
        groups {
          id
          info {
            name
            description
          }
          __typename
        }
      }
    }
  `,
  mockQueryFn: () => UserAndGroupByQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
