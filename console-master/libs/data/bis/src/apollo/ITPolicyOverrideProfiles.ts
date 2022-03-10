import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { ITPolicyOverrideProfilesQueryMock } from './mocks'

export const ITPolicyOverrideProfilesQuery: ApolloQuery<typeof ITPolicyOverrideProfilesQueryMock, void> = {
  displayName: 'ITPolicyOverrideProfilesQuery',
  query: gql`
    query itPolicyOverrideProfiles {
      itPolicyOverrideProfiles: BIS_itPolicyOverrideProfiles {
        profileGuid
        name
      }
    }
  `,
  mockQueryFn: () => ITPolicyOverrideProfilesQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
