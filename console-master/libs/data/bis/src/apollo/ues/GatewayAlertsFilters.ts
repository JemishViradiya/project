import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, Permission } from '@ues-data/shared'

import { GatewayAlertsFiltersQueryMock } from '../mocks/ues/GatewayAlertsFilters.mock'

export interface GatewayAlertsFiltersQueryResult {
  eventFilters: Array<{
    key: string
    count: number
  }>
}

export const GatewayAlertsFiltersQuery: ApolloQuery<
  GatewayAlertsFiltersQueryResult,
  { range: any; type: string; userIds: string[]; containerIds?: string[] }
> = {
  displayName: 'EventFiltersQuery',
  query: gql`
    query eventFilters($range: TimeRange!, $type: String, $userIds: [String], $containerIds: [String]) {
      eventFilters: BIS_gatewayEventFilters(range: $range, type: $type, userIds: $userIds, containerIds: $containerIds) {
        key
        count
      }
    }
  `,
  mockQueryFn: () => GatewayAlertsFiltersQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: new Set([Permission.BIS_EVENTS_READ]),
}
