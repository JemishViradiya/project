/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { gql } from '@apollo/client'

import type { ApolloMutation, ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, Permission } from '@ues-data/shared'

import { mobileAlertsMock, mobileAlertSummariesMock, mobileDevicesWithAlertsMock } from './mocks'

const ignoreAllMobileAlertsQueryGpl = gql`
  mutation IgnoreAllMobileAlerts($filter: MobileAlertsFilter!, $mobileAlertIds: [String]) {
    ignoreAllMobileAlerts(filter: $filter, mobileAlertIds: $mobileAlertIds) {
      count
      status
      errors
    }
  }
`

const ignoreMobileAlertsQueryGpl = gql`
  mutation IgnoreMobileAlerts($mobileAlertIds: [String]!) {
    ignoreMobileAlerts(mobileAlertIds: $mobileAlertIds) {
      count
      status
      errors
    }
  }
`

const mobileAlertsQueryGpl = gql`
  query GetMobileAlerts(
    $sortBy: SortBy
    $sortDirection: SortDirection
    $max: Int
    $filter: MobileAlertsFilter!
    $cursor: String
    $isExport: Boolean
  ) {
    mobileAlerts(sortBy: $sortBy, sortDirection: $sortDirection, max: $max, filter: $filter, cursor: $cursor, isExport: $isExport) {
      __typename
      totals {
        __typename
        pages
        elements
      }
      count
      cursor
      hasMore
      elements {
        __typename
        id
        status
        type
        name
        description
        userName
        deviceName
        detected
        resolved
        values {
          key
          value
        }
      }
    }
  }
`

const mobileAlertSummariesQueryGpl = gql`
  query GetMobileAlertSummaries(
    $sortBy: SortBy
    $sortDirection: SortDirection
    $max: Int
    $filter: MobileAlertsFilter!
    $cursor: String
  ) {
    mobileAlertSummaries(sortBy: $sortBy, sortDirection: $sortDirection, max: $max, filter: $filter, cursor: $cursor) {
      __typename
      count
      cursor
      hasMore
      elements {
        __typename
        id
        name
        type
        threatCount
        deviceCount
        firstDetected
        lastDetected
      }
    }
  }
`

const mobileDevicesWithAlertsQueryGpl = gql`
  query GetMobileDevicesWithAlerts(
    $sortBy: SortBy
    $sortDirection: SortDirection
    $max: Int
    $filter: MobileAlertsFilter!
    $cursor: String
  ) {
    mobileDevicesWithAlerts(sortBy: $sortBy, sortDirection: $sortDirection, max: $max, filter: $filter, cursor: $cursor) {
      __typename
      count
      cursor
      hasMore
      elements {
        __typename
        id
        deviceName
        userName
        threatCount
        firstDetected
        lastDetected
        endpointIds
      }
    }
  }
`

export interface IgnoreAllMobileAlertMutationVariables {
  filter?: MobileAlertsFilterVariables
  mobileAlertIds?: Array<{ string }>
}

export interface IgnoreMobileAlertMutationVariables {
  mobileAlertIds?: Array<{ string }>
}

export interface MobileAlertsFilterVariables {
  detectedStart?: string
  detectedEnd?: string
  type?: Array<{ string }>
  status?: Array<{ string }>
  name?: string
  description?: string
  deviceName?: string
  userName?: string
  deviceId?: string
  endpointId?: string
}

export interface MobileAlertQueryVariables {
  sortBy?: string
  sortDirection?: string
  max?: number
  cursor?: string
  filter?: MobileAlertsFilterVariables
  isExport?: boolean
}

export interface mobileAlertSummariesFilterVariables {
  detectedStart?: string
  detectedEnd?: string
  type?: Array<{ string }>
  name?: string
}

export interface MobileAlertGroupByDetectionQueryVariables {
  sortBy?: string
  sortDirection?: string
  max?: number
  cursor?: string
  filter?: mobileAlertSummariesFilterVariables
}

export interface mobileDevicesWithAlertsFilterVariables {
  detectedStart?: string
  detectedEnd?: string
  deviceName?: string
  userName?: string
}

export interface MobileAlertGroupByDeviceQueryVariables {
  sortBy?: string
  sortDirection?: string
  max?: number
  cursor?: string
  filter?: mobileDevicesWithAlertsFilterVariables
}

const eventsReadPermissions = new Set([Permission.MTD_EVENTS_READ])

export const ignoreAllMobileAlertsMutation: ApolloMutation<unknown, IgnoreAllMobileAlertMutationVariables> = {
  mutation: ignoreAllMobileAlertsQueryGpl,
  mockMutationFn: () => Promise.resolve(),
  context: getApolloQueryContext(APOLLO_DESTINATION.THREAT_EVENTS_BFF),
  permissions: eventsReadPermissions,
}

export const ignoreMobileAlertsMutation: ApolloMutation<unknown, IgnoreMobileAlertMutationVariables> = {
  mutation: ignoreMobileAlertsQueryGpl,
  mockMutationFn: () => Promise.resolve(),
  context: getApolloQueryContext(APOLLO_DESTINATION.THREAT_EVENTS_BFF),
  permissions: eventsReadPermissions,
}

export const mobileAlertsQuery: ApolloQuery<any, MobileAlertQueryVariables> = {
  mockQueryFn: () => mobileAlertsMock,
  query: mobileAlertsQueryGpl,
  context: getApolloQueryContext(APOLLO_DESTINATION.THREAT_EVENTS_BFF),
  iterator: ({ cursor, ...rest }, data) => {
    if (!data || !data?.mobileAlerts?.hasMore) return null
    return { cursor: data?.mobileAlerts?.cursor, ...rest }
  },
  mockOverrideId: 'UES.MockOverride.mobileAlertsMock.Enabled',
  permissions: eventsReadPermissions,
}

export const mobileAlertSummariesQuery: ApolloQuery<any, MobileAlertGroupByDetectionQueryVariables> = {
  mockQueryFn: () => mobileAlertSummariesMock,
  query: mobileAlertSummariesQueryGpl,
  context: getApolloQueryContext(APOLLO_DESTINATION.THREAT_EVENTS_BFF),
  mockOverrideId: 'UES.MockOverride.mobileAlertSummariesMock.Enabled',
  permissions: eventsReadPermissions,
}

export const mobileDevicesWithAlertsQuery: ApolloQuery<any, MobileAlertGroupByDeviceQueryVariables> = {
  mockQueryFn: () => mobileDevicesWithAlertsMock,
  query: mobileDevicesWithAlertsQueryGpl,
  context: getApolloQueryContext(APOLLO_DESTINATION.THREAT_EVENTS_BFF),
  mockOverrideId: 'UES.MockOverride.mobileDevicesWithAlertsMock.Enabled',
  permissions: eventsReadPermissions,
}
