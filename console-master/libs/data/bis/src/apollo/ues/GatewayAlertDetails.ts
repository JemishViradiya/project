import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, Permission } from '@ues-data/shared'

import type { ChallengeState } from '../../model'
import { GatewayAlertDetailsMock } from '../mocks/ues/GatewayAlertDetails.mock'

export interface GatewayAlertDetailsQueryResult {
  eventDetails: {
    assessment: {
      datetime: number
      eEcoId: string | null
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
          flowId: number | null
          totalEvents: number | null
          totalAnomalousEvents: number | null
        }
      }
      datapoint: {
        datapointId: string
        source: {
          deviceModel: string | null
          containerId: string | null
          entitlementId: string | null
          os: string | null
        }
      }
      userInfo: {
        displayName: string | null
      }
    }
    sisActions: {
      policyName: string | null
      actions: Array<{
        type: string | null
        entityId: string | null
        name: string | null
      }>
    }
    fixup: ChallengeState | null
  }
}

export const GatewayAlertDetailsQuery: ApolloQuery<GatewayAlertDetailsQueryResult, { id: string; riskTypes: string[] }> = {
  displayName: 'GatewayAlertDetails',
  query: gql`
    query eventDetails($id: String, $riskTypes: [String!]!) {
      eventDetails: BIS_eventDetails(id: $id, riskTypes: $riskTypes) {
        assessment {
          datetime
          eEcoId
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
              flowId
              totalEvents
              totalAnomalousEvents
            }
          }
          datapoint {
            datapointId
            source {
              deviceModel
              containerId
              os
              entitlementId
            }
          }
          userInfo {
            displayName
          }
        }
        sisActions {
          policyName
          actions {
            type
            entityId
            name
          }
        }
        fixup
      }
    }
  `,
  mockQueryFn: () => GatewayAlertDetailsMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: new Set([Permission.BIS_EVENTS_READ]),
}
