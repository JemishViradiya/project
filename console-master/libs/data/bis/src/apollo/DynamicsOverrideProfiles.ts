import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { DynamicsOverrideProfilesQueryMock } from './mocks'

export const DynamicsOverrideProfilesQuery: ApolloQuery<typeof DynamicsOverrideProfilesQueryMock, void> = {
  displayName: 'DynamicsOverrideProfilesQuery',
  query: gql`
    query dynamicsOverrideProfiles {
      dynamicsOverrideProfiles: BIS_dynamicsOverrideProfiles {
        profileGuid
        name
      }
    }
  `,
  mockQueryFn: () => DynamicsOverrideProfilesQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
