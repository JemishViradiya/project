import { gql } from '@apollo/client'

import type { ApolloSubscription } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { EventCountQueryMock } from './mocks'
import type { TimeRangeInput } from './types'

export const EventCountQuery: ApolloSubscription<
  typeof EventCountQueryMock,
  { eventCountChanged: number },
  { range: TimeRangeInput }
> = {
  displayName: 'EventCountQuery',
  query: gql`
    query eventCount($range: TimeRange!) {
      eventCount: BIS_eventCount(range: $range)
    }
  `,
  subscription: gql`
    subscription onEventCountChanged($range: TimeRange!) {
      eventCountChanged: BIS_eventCountChanged(range: $range)
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
      eventCount: subscriptionData.data.eventCountChanged,
    }
  },
  mockQueryFn: () => EventCountQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
