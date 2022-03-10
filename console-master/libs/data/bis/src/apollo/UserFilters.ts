import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { UserFiltersQueryMock } from './mocks'

export const UserFiltersQuery: ApolloQuery<typeof UserFiltersQueryMock, { type: string }> = {
  displayName: 'UserFiltersQuery',
  query: gql`
    query userFilters($type: String) {
      userFilters: BIS_userFilters(type: $type) {
        key
        count
      }
    }
  `,
  mockQueryFn: () => UserFiltersQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
