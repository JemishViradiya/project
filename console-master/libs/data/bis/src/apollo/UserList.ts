/* eslint-disable sonarjs/no-nested-template-literals */
import memoizeOne from 'memoize-one'

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { UserListQueryMock } from './mocks'

export const UserListQuery = memoizeOne(
  (
    privacyEnabled,
    riskScoreResponseFormatEnabled,
    ipAddressRiskEnabled,
    networkAnomalyDetectionEnabled,
  ): ApolloQuery<
    typeof UserListQueryMock,
    {
      size: number
      offset: number
      sortBy: string
      sortDirection: string
      behavioralRiskLevel: string[]
      geozoneRiskLevel: string[]
      appAnomalyDetectionRiskLevel: string[]
      networkAnomalyDetectionRiskLevel: string[]
      ipAddressRisk: string[]
      fixup: string[]
      geoBounds: any
      username: string
      queryString: string
      location: string[]
    }
  > => ({
    displayName: 'UserListQuery',
    query: gql`
    query users(
      $size: Int
      $offset: Int
      $sortBy: String
      $sortDirection: String
      $behavioralRiskLevel: [RiskLevel]
      $geozoneRiskLevel: [GeozoneRiskLevel]
      ${riskScoreResponseFormatEnabled ? '$appAnomalyDetectionRiskLevel: [AnomalyDetectionRiskLevel]' : ''}
      ${
        riskScoreResponseFormatEnabled && networkAnomalyDetectionEnabled
          ? '$networkAnomalyDetectionRiskLevel: [AnomalyDetectionRiskLevel]'
          : ''
      }
      ${ipAddressRiskEnabled ? '$ipAddressRisk: [IpAddressSourceType]' : ''}
      $fixup: [ChallengeState]
      $geoBounds: InputBoundingBox
      $username: String
      $queryString: String
      $location: [LocationStatus]
    ) {
      users: BIS_users(
        size: $size
        offset: $offset
        sortBy: $sortBy
        sortDirection: $sortDirection
        behavioralRiskLevel: $behavioralRiskLevel
        geozoneRiskLevel: $geozoneRiskLevel
        ${riskScoreResponseFormatEnabled ? 'appAnomalyDetectionRiskLevel: $appAnomalyDetectionRiskLevel' : ''}
        ${
          riskScoreResponseFormatEnabled && networkAnomalyDetectionEnabled
            ? 'networkAnomalyDetectionRiskLevel: $networkAnomalyDetectionRiskLevel'
            : ''
        }
        ${ipAddressRiskEnabled ? 'ipAddressRisk: $ipAddressRisk' : ''}
        fixup: $fixup
        geoBounds: $geoBounds
        username: $username
        queryString: $queryString
        location: $location
      ) {
        total
        users {
          id
          info {
            displayName
            department
            primaryEmail
            title
          }
          operatingMode
          fixup
          updated
          assessment {
            eEcoId
            datetime
            behavioralRiskLevel
            geozoneRiskLevel
            ipAddress
            ${privacyEnabled ? '' : 'location { lat lon }'}
            mappings {
              behavioral {
                score
                riskLevel
              }
              definedgeozone {
                meta {
                  geozoneId
                  geozoneName
                }
              }
              ${riskScoreResponseFormatEnabled ? 'appAnomalyDetection { riskScore }' : ''}
              ${riskScoreResponseFormatEnabled && networkAnomalyDetectionEnabled ? 'networkAnomalyDetection { riskScore }' : ''}
              ${
                ipAddressRiskEnabled
                  ? `
                ipAddress {
                  riskScore
                  mappings {
                    source
                  }
                }`
                  : ''
              }
            }
            datapoint {
              source {
                appName
                deviceModel
              }
            }
          }
          sisActions {
            policyGuid
            policyName
            actions {
              type
              groupId
              groupName
              profileId
              profileName
              alertMessage
              entityId
              name
            }
          }
        }
      }
    }
  `,
    mockQueryFn: () => UserListQueryMock,
    context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
    permissions: NoPermissions,
  }),
)
