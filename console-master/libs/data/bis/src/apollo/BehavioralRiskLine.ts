import { gql } from '@apollo/client'

import type { ApolloSubscription } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import type { RiskLevelTypes } from '../model'
import { BehavioralRiskLineQueryMock } from './mocks'
import type { TimeRangeInput } from './types'

const selection = `
  bucket
  data {
    time
    count
  }
`

type BehavioralRiskLineResult = Array<{
  bucket:
    | Lowercase<RiskLevelTypes.CRITICAL>
    | Lowercase<RiskLevelTypes.HIGH>
    | Lowercase<RiskLevelTypes.MEDIUM>
    | Lowercase<RiskLevelTypes.LOW>
  data: Array<{
    time: number
    count: number
  }>
}>

export interface BehavioralRiskLineQueryResult {
  behaviorRiskLine: BehavioralRiskLineResult
}

interface BehavioralRiskLineSubscriptionResult {
  behaviorRiskLineChanged: BehavioralRiskLineResult
}

export const BehavioralRiskLineQuery: ApolloSubscription<
  BehavioralRiskLineQueryResult,
  BehavioralRiskLineSubscriptionResult,
  { range: TimeRangeInput }
> = {
  displayName: 'BehavioralRiskLineQuery',
  query: gql`
    query behaviorRiskLine($range: TimeRange!) {
      behaviorRiskLine: BIS_behaviorRiskLine(range: $range) {
        ${selection}
      }
    }
  `,
  subscription: gql`
    subscription onBehaviorRiskLineChanged($range: TimeRange!) {
      behaviorRiskLineChanged: BIS_behaviorRiskLineChanged(range: $range) {
        ${selection}
      }
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
      behaviorRiskLine: subscriptionData.data.behaviorRiskLineChanged,
    }
  },
  mockQueryFn: () => BehavioralRiskLineQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
