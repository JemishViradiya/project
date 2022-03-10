import { gql } from '@apollo/client'

import type { ApolloSubscription } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import type { RiskLevelTypes } from '../model'
import { GeozoneRiskLineQueryMock } from './mocks'
import type { TimeRangeInput } from './types'

const selection = `
  bucket
  data {
    time
    count
  }
`

type GeozoneRiskLineResult = Array<{
  bucket: Lowercase<RiskLevelTypes.HIGH> | Lowercase<RiskLevelTypes.MEDIUM> | Lowercase<RiskLevelTypes.LOW>
  data: Array<{
    time: number
    count: number
  }>
}>

export interface GeozoneRiskLineQueryResult {
  geozoneRiskLine: GeozoneRiskLineResult
}

interface GeozoneRiskLineSubscriptionResult {
  geozoneRiskLineChanged: GeozoneRiskLineResult
}

export const GeozoneRiskLineQuery: ApolloSubscription<
  GeozoneRiskLineQueryResult,
  GeozoneRiskLineSubscriptionResult,
  { range: TimeRangeInput }
> = {
  displayName: 'GeozoneRiskLineQuery',
  query: gql`
    query geozoneRiskLine($range: TimeRange!) {
      geozoneRiskLine: BIS_geozoneRiskLine(range: $range) {
        ${selection}
      }
    }
  `,
  subscription: gql`
    subscription onGeozoneRiskLineChanged($range: TimeRange!) {
      geozoneRiskLineChanged: BIS_geozoneRiskLineChanged(range: $range) {
        ${selection}
      }
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
      geozoneRiskLine: subscriptionData.data.geozoneRiskLineChanged,
    }
  },
  mockQueryFn: () => GeozoneRiskLineQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
