import { gql } from '@apollo/client'

import type { ApolloSubscription } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { OperatingModeQueryMock } from './mocks'

export const OperatingModeQuery: ApolloSubscription<typeof OperatingModeQueryMock, typeof OperatingModeQueryMock, void> = {
  displayName: 'OperatingModeQuery',
  query: gql`
    query operatingMode {
      operatingMode: BIS_operatingMode
    }
  `,
  subscription: gql`
    subscription onOperatingModeChanged {
      operatingModeChanged: BIS_operatingModeChanged
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
      operatingMode: subscriptionData.data.operatingModeChanged,
    }
  },
  mockQueryFn: () => OperatingModeQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
