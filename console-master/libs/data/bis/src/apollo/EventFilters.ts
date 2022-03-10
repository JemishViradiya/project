import { gql } from '@apollo/client'

import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { EventFiltersQueryMock } from './mocks'

const selection = `
  key
  count
`

export const EventFiltersQuery = {
  displayName: 'EventFiltersQuery',
  query: gql`
    query eventFilters($range: TimeRange!, $type: String) {
      eventFilters: BIS_eventFilters(range: $range, type: $type) {
        ${selection}
      }
    }
  `,
  subscription: gql`
    subscription onEventFiltersChanged($range: TimeRange!, $type: String) {
      eventFiltersChanged: BIS_eventFiltersChanged(range: $range, type: $type) {
        ${selection}
      }
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
      eventFilters: subscriptionData.data.eventFiltersChanged,
    }
  },
  mockQueryFn: () => EventFiltersQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
