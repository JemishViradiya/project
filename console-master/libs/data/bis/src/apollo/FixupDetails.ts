import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { FixupDetailsQueryMock } from './mocks'

export const FixupDetailsQuery: ApolloQuery<typeof FixupDetailsQueryMock, { datapointId: string }> = {
  displayName: 'FixupDetailsQuery',
  query: gql`
    query fixupDetails($datapointId: ID!) {
      fixupDetails: BIS_fixupDetails(datapointId: $datapointId) {
        datetime
        eEcoId
        behavioralRiskLevel
        issuedIdentityChallenge {
          state
        }
        reAuthenticateToConfirm {
          challengeResponseResult
          authType
          error
        }
      }
    }
  `,
  mockQueryFn: () => FixupDetailsQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
