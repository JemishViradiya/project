/* eslint-disable sonarjs/no-duplicate-string */
import memoizeOne from 'memoize-one'

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import {
  EventGeozoneQueryMock,
  EventUnknownLocationQueryMock,
  MapGeozoneQueryMock,
  MapUnknownLocationQueryMock,
  UserDetailsGeozoneQueryMock,
  UserDetailsUnknownLocationQueryMock,
} from './mocks'

export const EventGeozoneQuery = memoizeOne(
  (
    riskScoreResponseFormatEnabled,
    ipAddressRiskEnabled,
    networkAnomalyDetectionEnabled,
  ): ApolloQuery<
    typeof EventGeozoneQueryMock,
    {
      range: any
      behavioralRiskLevel?: string[]
      geozoneRiskLevel?: string[]
      appAnomalyDetectionRiskLevel?: string[]
      networkAnomalyDetectionRiskLevel?: string[]
      ipAddressRisk?: string[]
      fixup?: string[]
      geoBounds?: any
      username?: string
      queryString?: string
      ids?: string[]
      selectMode?: boolean
      zoomLevel?: number
      location?: string[]
      riskTypes: string[]
    }
  > => ({
    displayName: 'EventGeozoneQuery',
    query: gql`
    query eventGeoClusters(
      $range: TimeRange!
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
      $ids: [ID]
      $selectMode: Boolean
      $zoomLevel: Int
      $location: [LocationStatus]
      $riskTypes: [String!]!
    ) {
      eventGeoClusters: BIS_eventGeoClusters(
        range: $range
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
        ids: $ids
        selectMode: $selectMode
        zoomLevel: $zoomLevel
        location: $location
        riskTypes: $riskTypes
      ) {
        geohash
        lat
        lon
        bounds {
          top_left {
            lat
            lon
          }
          bottom_right {
            lat
            lon
          }
        }
        count
        critical
        high
        medium
        low
        representative {
          id
          riskLevel
        }
      }
    }
  `,
    mockQueryFn: () => EventGeozoneQueryMock,
    context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
    permissions: NoPermissions,
  }),
)

export const EventUnknownLocationQuery = memoizeOne(
  (
    riskScoreResponseFormatEnabled,
    ipAddressRiskEnabled,
    networkAnomalyDetectionEnabled,
  ): ApolloQuery<
    typeof EventUnknownLocationQueryMock,
    {
      size?: number
      offset?: number
      range: any
      sortBy?: string
      sortDirection?: string
      behavioralRiskLevel?: string[]
      geozoneRiskLevel?: string[]
      appAnomalyDetectionRiskLevel?: string[]
      networkAnomalyDetectionRiskLevel?: string[]
      ipAddressRisk?: string[]
      fixup?: string[]
      geoBounds?: any
      geoZoomLevel: number
      username: string
      queryString: string
      userIds: string[]
      location: string[]
    }
  > => ({
    displayName: 'EventUnknownLocationQuery',
    query: gql`
    query eventUnknownLocation(
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
      eventUnknownLocation: BIS_eventUnknownLocation(
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
      }
    }
  `,
    mockQueryFn: () => EventUnknownLocationQueryMock,
    context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
    permissions: NoPermissions,
  }),
)

export const UserDetailsGeozoneQuery: ApolloQuery<
  typeof UserDetailsGeozoneQueryMock,
  {
    behavioralRiskLevel?: string[]
    fixup?: string[]
    geoBounds?: any
    geozoneRiskLevel?: string[]
    ids?: string[]
    queryString?: string
    range: any
    riskTypes: string[]
    selectMode?: boolean
    userId: string
    username?: string
    zoomLevel?: number
  }
> = {
  displayName: 'UserDetailsGeozoneQuery',
  query: gql`
    query userDetailsClusters(
      $range: TimeRange!
      $behavioralRiskLevel: [RiskLevel]
      $geozoneRiskLevel: [GeozoneRiskLevel]
      $fixup: [ChallengeState]
      $geoBounds: InputBoundingBox
      $userId: String!
      $username: String
      $queryString: String
      $ids: [ID]
      $selectMode: Boolean
      $zoomLevel: Int
      $riskTypes: [String!]!
    ) {
      eventGeoClusters: BIS_eventGeoClusters(
        range: $range
        behavioralRiskLevel: $behavioralRiskLevel
        geozoneRiskLevel: $geozoneRiskLevel
        fixup: $fixup
        geoBounds: $geoBounds
        userIds: [$userId]
        username: $username
        queryString: $queryString
        ids: $ids
        selectMode: $selectMode
        zoomLevel: $zoomLevel
        riskTypes: $riskTypes
      ) {
        geohash
        lat
        lon
        bounds {
          top_left {
            lat
            lon
          }
          bottom_right {
            lat
            lon
          }
        }
        count
        critical
        high
        medium
        low
        representative {
          id
          riskLevel
          behavioralRiskLevel
          assessment {
            eEcoId
            datetime
            behavioralRiskLevel
            geozoneRiskLevel
            location {
              lat
              lon
              geohash
            }
            ipAddress
            datapoint {
              source {
                deviceModel
              }
            }
            mappings {
              behavioral {
                score
              }
              definedgeozone {
                meta {
                  geozoneName
                }
              }
            }
          }
          operatingMode
          sisActions {
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
  mockQueryFn: () => UserDetailsGeozoneQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

export const UserDetailsUnknownLocationQuery: ApolloQuery<
  typeof UserDetailsUnknownLocationQueryMock,
  {
    behavioralRiskLevel?: string[]
    fixup?: string[]
    geoBounds?: any
    geozoneRiskLevel?: string[]
    geoZoomLevel?: number
    location?: any[]
    offset?: number
    queryString?: string
    range: any
    size?: number
    sortBy?: string
    sortDirection?: string
    userId: string
    username?: string
  }
> = {
  displayName: 'UserDetailsUnknownLocationQuery',
  query: gql`
    query eventUserDetailsUnknownLocation(
      $size: Int
      $offset: Int
      $range: TimeRange!
      $sortBy: String
      $sortDirection: String
      $behavioralRiskLevel: [RiskLevel]
      $geozoneRiskLevel: [GeozoneRiskLevel]
      $fixup: [ChallengeState]
      $geoBounds: InputBoundingBox
      $geoZoomLevel: Int
      $username: String
      $queryString: String
      $userId: String!
      $location: [LocationStatus]
    ) {
      eventUserDetailsUnknownLocation: BIS_eventUserDetailsUnknownLocation(
        size: $size
        offset: $offset
        range: $range
        sortBy: $sortBy
        sortDirection: $sortDirection
        behavioralRiskLevel: $behavioralRiskLevel
        geozoneRiskLevel: $geozoneRiskLevel
        fixup: $fixup
        geoBounds: $geoBounds
        geoZoomLevel: $geoZoomLevel
        username: $username
        queryString: $queryString
        userIds: [$userId]
        location: $location
      ) {
        total
      }
    }
  `,
  mockQueryFn: () => UserDetailsUnknownLocationQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

export const MapGeozoneQuery = memoizeOne(
  (
    riskScoreResponseFormatEnabled,
    ipAddressRiskEnabled,
    networkAnomalyDetectionEnabled,
  ): ApolloQuery<typeof MapGeozoneQueryMock, any> => ({
    displayName: 'MapGeozoneQuery',
    query: gql`
    query userGeoClusters(
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
      $users: [String]
      $selectMode: Boolean
      $zoomLevel: Int
      $location: [LocationStatus]
      $riskTypes: [String!]!
    ) {
      userGeoClusters: BIS_userGeoClusters(
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
        users: $users
        selectMode: $selectMode
        zoomLevel: $zoomLevel
        location: $location
        riskTypes: $riskTypes
      ) {
        geohash
        lat
        lon
        bounds {
          top_left {
            lat
            lon
          }
          bottom_right {
            lat
            lon
          }
        }
        count
        critical
        high
        medium
        low
        user {
          info {
            avatar
            displayName
            department
            givenName
            familyName
            username
            title
          }
          riskLevel
          assessment {
            eEcoId
            datetime
            behavioralRiskLevel
            geozoneRiskLevel
            ipAddress
            location {
              lat
              lon
            }
          }
        }
      }
    }
  `,
    mockQueryFn: () => MapGeozoneQueryMock,
    context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
    permissions: NoPermissions,
  }),
)

export const MapUnknownLocationQuery = memoizeOne(
  (
    riskScoreResponseFormatEnabled,
    ipAddressRiskEnabled,
    networkAnomalyDetectionEnabled,
  ): ApolloQuery<typeof MapUnknownLocationQueryMock, any> => ({
    displayName: 'MapUnknownLocationQuery',
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
      usersUnknownLocation: BIS_usersUnknownLocation(
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
      }
    }
  `,
    mockQueryFn: () => MapUnknownLocationQueryMock,
    context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
    permissions: NoPermissions,
  }),
)
