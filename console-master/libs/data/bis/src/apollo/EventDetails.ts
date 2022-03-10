import memoizeOne from 'memoize-one'

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { eventQuerySelection } from './BucketedUserEvents'
import { EventDetailsQueryMock } from './mocks'

export const EventDetailsQuery = memoizeOne(
  (
    RiskScoreResponseFormat,
    IpAddressRisk,
    NetworkAnomalyDetection,
  ): ApolloQuery<typeof EventDetailsQueryMock, { id: string; riskTypes: string }> => ({
    displayName: 'EventDetailsQuery',
    query: gql`
    query eventDetails($id: String, $riskTypes: [String!]!) {
      eventDetails: BIS_eventDetails(id: $id, riskTypes: $riskTypes) {
        ${eventQuerySelection(RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection)}
      }
    }
  `,
    mockQueryFn: () => EventDetailsQueryMock,
    context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
    permissions: NoPermissions,
  }),
)
