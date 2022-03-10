import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { PolicyRankQueryMock, PolicyRankUpdateMutationMock } from './mocks'

export const PolicyRankQuery: ApolloQuery<typeof PolicyRankQueryMock, void> = {
  displayName: 'PolicyRankQuery',
  query: gql`
    query policies {
      policies: BIS_policies {
        id: policyId
        name
      }
    }
  `,
  mockQueryFn: () => PolicyRankQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

export const PolicyRankUpdateMutation = {
  displayName: 'PolicyRankUpdateMutation',
  mutation: gql`
    mutation updatePolicyRankings($ids: [ID]!) {
      updatePolicyRankings: BIS_updatePolicyRankings(ids: $ids)
    }
  `,
  mockMutationFn: () => PolicyRankUpdateMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}
