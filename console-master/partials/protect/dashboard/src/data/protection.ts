//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

// POST Dashboard/TotalFilesAnalyzed <empty>

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

const getThreatProtectionPercentGql = gql`
  query GetThreatProtectionPercent {
    threatProtection @rest(type: "ThreatProtectionPercent", path: "/Dashboard/GetThreatProtectionPercentage") {
      value: number
    }
  }
`

export interface ThreatProtectionPercent {
  value: number
}

export const getThreatProtectionPercent: ApolloQuery<{ threatProtection: ThreatProtectionPercent }, void> = {
  permissions: NoPermissions,
  query: getThreatProtectionPercentGql,
  mockQueryFn: () => ({
    threatProtection: {
      value: 64,
    },
  }),
  context: getApolloQueryContext(APOLLO_DESTINATION.VENUE_API),
}

const getDeviceProtectionPercentGql = gql`
  query GetDeviceProtectionPercent {
    deviceProtection @rest(type: "DeviceProtectionPercent", path: "/Dashboard/GetDeviceProtectionPercentage") {
      value: number
    }
  }
`

export interface DeviceProtectionPercent {
  value: number
}

export const getDeviceProtectionPercent: ApolloQuery<{ deviceProtection: DeviceProtectionPercent }, void> = {
  permissions: NoPermissions,
  query: getDeviceProtectionPercentGql,
  mockQueryFn: () => ({
    deviceProtection: {
      value: 32,
    },
  }),
  context: getApolloQueryContext(APOLLO_DESTINATION.VENUE_API),
}
