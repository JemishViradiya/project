import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, Permission } from '@ues-data/shared'

import type { ChallengeState } from '../../model'
import { GatewayAlertsFixupDetailsQueryMock } from '../mocks/ues'

export interface GatewayAlertsFixupDetailsQueryResult {
  fixupDetails: Array<{
    datetime: number
    state: ChallengeState
    previousBehavioralRiskLevel?: string
  }>
}

export const GatewayAlertsFixupDetailsQuery: ApolloQuery<GatewayAlertsFixupDetailsQueryResult, { datapointId: string }> = {
  displayName: 'GatewayAlertsFixupDetailsQuery',
  query: gql`
    query fixupDetails($datapointId: ID!) {
      fixupDetails: BIS_fixupDetails(datapointId: $datapointId) {
        datetime
        state
        previousBehavioralRiskLevel
      }
    }
  `,
  mockQueryFn: () => GatewayAlertsFixupDetailsQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: new Set([Permission.BIS_EVENTS_READ]),
}
