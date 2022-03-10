import { gql } from '@apollo/client'

import type { ApolloSubscription } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { LatestEventsQueryMock } from './mocks'

const selection = `
  datetime
  low
  medium
  high
  critical
  total
`

export const LatestEventsQuery: ApolloSubscription<typeof LatestEventsQueryMock, typeof LatestEventsQueryMock, void> = {
  displayName: 'LatestEventsQuery',
  query: gql`
    # unknown count will soon be required, but not now...
    query latestEvents {
      latestEvents: BIS_latestEvents {
        ${selection}
      }
    }
  `,
  subscription: gql`
    # unknown count will soon be required, but not now...
    subscription onLatestEventsChanged {
      latestEventsChanged: BIS_latestEventsChanged {
        ${selection}
      }
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
      latestEvents: subscriptionData.data.latestEventsChanged,
    }
  },
  mockQueryFn: () => LatestEventsQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
