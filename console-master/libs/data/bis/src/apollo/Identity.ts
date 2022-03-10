import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { IdentityQueryMock } from './mocks'

export const IdentityQuery: ApolloQuery<typeof IdentityQueryMock, void> = {
  displayName: 'IdentityQuery',
  query: gql`
    query identity {
      identity: BIS_identity {
        id
        avatar
        displayName
        department
        givenName
        familyName
        username
        primaryEmail
        title
        roleTitle
      }
    }
  `,
  mockQueryFn: () => IdentityQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
