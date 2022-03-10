/* eslint-disable sonarjs/no-nested-template-literals */
import memoizeOne from 'memoize-one'

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { EventListQueryMock } from './mocks'

export const EventListQuery = memoizeOne(
  (
    privacyEnabled,
    riskScoreResponseFormatEnabled,
    ipAddressRiskEnabled,
    networkAnomalyDetectionEnabled,
  ): ApolloQuery<typeof EventListQueryMock, any> => ({
    displayName: 'EventListQuery',
    query: gql`
    query eventInfiniteScroll(
      $size: Int
      $offset: Int
      $range: TimeRange!
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
      $geoZoomLevel: Int
      $username: String
      $queryString: String
      $userIds: [String]
      $location: [LocationStatus]
    ) {
      eventInfiniteScroll: BIS_eventInfiniteScroll(
        size: $size
        offset: $offset
        range: $range
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
        geoZoomLevel: $geoZoomLevel
        username: $username
        queryString: $queryString
        userIds: $userIds
        location: $location
      ) {
        total
        events {
          id
          operatingMode
          fixup
          updated
          assessment {
            eEcoId
            userInfo {
              displayName
            }
            datetime
            behavioralRiskLevel
            geozoneRiskLevel
            ${privacyEnabled ? '' : 'location { lat lon geohash }'}
            ipAddress
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
    mockQueryFn: () => EventListQueryMock,
    context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
    permissions: NoPermissions,
  }),
)
