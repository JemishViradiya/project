import memoizeOne from 'memoize-one'

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { BucketedUserEventsQueryMock } from './mocks'

export const eventQuerySelection = memoizeOne(
  (RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection) => `
  riskLevel
  fixup
  updated
  assessment {
    behavioralRiskLevel
    datetime
    eEcoId
    ipAddress
    geozoneRiskLevel
    location {
      lat
      lon
      geohash
    }
    mappings {
      behavioral {
        score
        riskLevel
      }
      definedgeozone {
        meta {
          geozoneName
        }
      }
      ${RiskScoreResponseFormat ? 'appAnomalyDetection { riskScore }' : ''}
      ${RiskScoreResponseFormat && NetworkAnomalyDetection ? 'networkAnomalyDetection { riskScore }' : ''}
      ${IpAddressRisk ? 'ipAddress { riskScore mappings { source } }' : ''}
    }
    datapoint {
      datapointId
      source {
        appName
        appVersion
        os
        osVersion
        deviceType
        deviceModel
        timezone
      }
    }
    userInfo {
      avatar
      displayName
      department
      givenName
      familyName
      username
      primaryEmail
      title
    }
  }
  operatingMode
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
`,
)

export const BucketedUserEventsQuery = memoizeOne(
  (
    RiskScoreResponseFormat,
    IpAddressRisk,
    NetworkAnomalyDetection,
  ): ApolloQuery<typeof BucketedUserEventsQueryMock, { eEcoId: string; range: any; numberOfBuckets: number }> => ({
    displayName: 'BucketedUserEventsQuery',
    query: gql`
    query bucketedUserEvents($eEcoId: String!, $range: TimeRange!, $numberOfBuckets: Int!) {
      bucketedUserEvents: BIS_bucketedUserEvents(eEcoId: $eEcoId, range: $range, numberOfBuckets: $numberOfBuckets) {
        interval
        buckets {
          datetime
          low
          medium
          high
          critical
          unknown
          total
          lastEventInBucket {
            ${eventQuerySelection(RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection)}
          }
        }
      }
    }
  `,
    mockQueryFn: () => BucketedUserEventsQueryMock,
    context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
    permissions: NoPermissions,
  }),
)
