import { gql } from '@apollo/client'

import type { ApolloSubscription } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { UserCountQueryMock } from './mocks'
import type { TimeRangeInput } from './types'

export const UserCountQuery: ApolloSubscription<
  typeof UserCountQueryMock,
  { userCountChanged: number },
  { range: TimeRangeInput }
> = {
  displayName: 'UserCountQuery',
  query: gql`
    query userCount($range: TimeRange!) {
      userCount: BIS_userCount(range: $range)
    }
  `,
  subscription: gql`
    subscription onUserCountChanged($range: TimeRange!) {
      userCountChanged: BIS_userCountChanged(range: $range)
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
      userCount: subscriptionData.data.userCountChanged,
    }
  },
  mockQueryFn: () => UserCountQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
