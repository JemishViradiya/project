//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { MOCK_ANDROID_OS_VERSIONS, MOCK_IOS_OS_VERSIONS } from '../mocks'

export interface MetadataQueryVariables {
  osFamily: string
  startOsVersion?: string
}

export const queryDeviceOsVersionsGpl = gql`
  query Metadata($osFamily: String!, $startOsVersion: String) {
    deviceOsVersions(osFamily: $osFamily, startOsVersion: $startOsVersion)
      @rest(type: "MtdDeviceOsVersion", path: "/mtd/v1/device-metadata/deviceos?{args}", method: "GET") {
      version: string
    }
  }
`

export const queryAndroidDeviceOsVersionsMock = {
  deviceOsVersions: MOCK_ANDROID_OS_VERSIONS,
}

export const queryIosDeviceOsVersionsMock = {
  deviceOsVersions: MOCK_IOS_OS_VERSIONS,
}

export const queryDeviceOsVersions: ApolloQuery<unknown, MetadataQueryVariables> = {
  mockQueryFn: args => (args.osFamily == 'android' ? queryAndroidDeviceOsVersionsMock : queryIosDeviceOsVersionsMock),
  query: queryDeviceOsVersionsGpl,
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  permissions: NoPermissions,
}
