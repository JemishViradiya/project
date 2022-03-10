import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { LocalGroupsQueryMock } from './mocks'

export const LocalGroupsQuery: ApolloQuery<
  typeof LocalGroupsQueryMock,
  {
    isDirectoryLinked: boolean
  }
> = {
  displayName: 'LocalGroupsQuery',
  query: gql`
    query localGroups($isDirectoryLinked: Boolean) {
      localGroups: BIS_localGroups(isDirectoryLinked: $isDirectoryLinked) {
        guid
        name
      }
    }
  `,
  mockQueryFn: () => LocalGroupsQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
