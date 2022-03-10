import { gql } from '@apollo/client'

import type { ApolloSubscription } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { TopActionsQueryMock } from './mocks'
import type { TimeRangeInput } from './types'

const selection = `
  action {
    type
    groupId
    groupName
    profileId
    profileName
    entityId
    name
  }
  count
`

export const TopActionsQuery: ApolloSubscription<
  typeof TopActionsQueryMock,
  { topActionsChanged: typeof TopActionsQueryMock['topActions'] },
  { range: TimeRangeInput; count: number }
> = {
  displayName: 'TopActionsQuery',
  query: gql`
    query topActions($range: TimeRange!, $count: Int = 3) {
      topActions: BIS_topActions(range: $range, count: $count) {
        ${selection}
      }
    }
  `,
  subscription: gql`
    subscription onTopActionsChanged($range: TimeRange!, $count: Int = 3) {
      topActionsChanged: BIS_topActionsChanged(range: $range, count: $count) {
        ${selection}
      }
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
      topActions: subscriptionData.data.topActionsChanged,
    }
  },
  mockQueryFn: () => TopActionsQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
