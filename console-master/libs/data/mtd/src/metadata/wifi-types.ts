//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { MOCK_WIFI_TYPES } from '../mocks'

const queryWifiGpl = gql`
  query WifiTypes {
    wifiTypes @rest(type: "MtdWifiTypes", path: "/mtd/v1/policies/wifi/types", method: "GET")
  }
`

const queryWifiTypesMock = {
  wifiTypes: [
    ...Object.keys(MOCK_WIFI_TYPES)
      .filter(key => isNaN(Number(key)))
      .map(key => key),
  ],
}

export const queryWifiTypes: ApolloQuery<unknown, unknown> = {
  mockQueryFn: () => queryWifiTypesMock,
  query: queryWifiGpl,
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  permissions: NoPermissions,
}

export default void 0
