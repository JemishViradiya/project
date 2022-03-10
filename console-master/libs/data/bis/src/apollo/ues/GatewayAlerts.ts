import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, Permission } from '@ues-data/shared'

import type { ChallengeState, OperatingMode } from '../../model'
import { GatewayAlertsQueryMock } from '../mocks'
import type { TimeRangeInput } from '../types'

export interface GatewayAlertsQueryEvent {
  id: string
  assessment: {
    eEcoId: string | null
    userInfo: {
      displayName: string | null
    }
    datetime: number
    identityAndBehavioralRisk: {
      level: string | null
    }
    mappings: {
      behavioral: {
        score: number | null
        riskLevel: string | null
      }
      networkAnomalyDetection: {
        riskScore: number | null
      }
    }
    datapoint: {
      source: {
        deviceModel: string | null
        containerId: string | null
        entitlementId: string | null
        os: string | null
      }
    }
  }
  sisActions: {
    policyName: string | null
    actions: Array<{ type: string | null; name: string | null }>
  }
  operatingMode: OperatingMode
  fixup: ChallengeState
}

export interface GatewayAlertsQueryResult {
  eventInfiniteScroll: {
    total: number
    events: GatewayAlertsQueryEvent[]
  }
}

export const GatewayAlertsQuery: ApolloQuery<
  GatewayAlertsQueryResult,
  {
    size: number
    range: TimeRangeInput
    offset: number
    behavioralRiskLevel?: string[]
    sortBy?: string
    sortDirection?: string
    riskScoreRange?: Array<{
      riskFactorId: string
      min: number
      max: number
    }>
    userIds?: string[]
    containerIds?: string[]
  }
> = {
  mockQueryFn: () => GatewayAlertsQueryMock,
  query: gql`
    query eventInfiniteScroll(
      $size: Int
      $range: TimeRange!
      $offset: Int
      $behavioralRiskLevel: [RiskLevel]
      $sortBy: String
      $sortDirection: String
      $username: String
      $queryString: String
      $riskScoreRange: [RiskScoreRange]
      $userIds: [String]
      $containerIds: [String]
    ) {
      eventInfiniteScroll: BIS_eventGatewayInfiniteScroll(
        size: $size
        range: $range
        sortBy: $sortBy
        sortDirection: $sortDirection
        offset: $offset
        behavioralRiskLevel: $behavioralRiskLevel
        username: $username
        queryString: $queryString
        riskScoreRange: $riskScoreRange
        userIds: $userIds
        containerIds: $containerIds
      ) {
        total
        events {
          id
          assessment {
            eEcoId
            userInfo {
              displayName
            }
            datetime
            identityAndBehavioralRisk {
              level
            }
            mappings {
              behavioral {
                score
                riskLevel
              }
              networkAnomalyDetection {
                riskScore
              }
            }
            datapoint {
              source {
                deviceModel
                containerId
                os
                entitlementId
              }
            }
          }
          sisActions {
            policyName
            actions {
              type
              name
            }
          }
          operatingMode
          fixup
        }
      }
    }
  `,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: new Set([Permission.BIS_EVENTS_READ]),
}
