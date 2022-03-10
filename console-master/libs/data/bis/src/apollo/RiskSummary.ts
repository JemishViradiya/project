import { gql } from '@apollo/client'

import type { ApolloSubscription } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { RiskSummaryQueryMock } from './mocks'
import type { TimeRangeInput } from './types'

const selection = `
  bucket
  count
  key
  value
`

export const RiskSummaryQuery: ApolloSubscription<
  typeof RiskSummaryQueryMock,
  typeof RiskSummaryQueryMock,
  { range: TimeRangeInput }
> = {
  displayName: 'RiskSummaryQuery',
  query: gql`
    query riskSummary($range: TimeRange!) {
      riskSummary: BIS_riskSummary(range: $range) {
        ${selection}
      }
    }
  `,
  subscription: gql`
    subscription onRiskSummaryChanged($range: TimeRange!) {
      riskSummaryChanged: BIS_riskSummaryChanged(range: $range) {
        ${selection}
      }
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
      riskSummary: subscriptionData.data.riskSummaryChanged ? [...subscriptionData.data.riskSummaryChanged] : null,
    }
  },
  mockQueryFn: () => RiskSummaryQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
