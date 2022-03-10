//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReportingServiceQueryVariables, ReportingServiceTunnelAggResponse } from '@ues-data/gateway'
import { queryTopNetworkDestinationsGql, ReportingServiceContext, topNetworkDestinationsMock } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'

import { ReportingReadPermissions } from '../settings/permissions'

export const queryTopNetworkDestinations: ApolloQuery<ReportingServiceTunnelAggResponse, ReportingServiceQueryVariables> = {
  permissions: ReportingReadPermissions,
  mockQueryFn: ({ filter: { networkRoute } }) => topNetworkDestinationsMock[networkRoute],
  query: queryTopNetworkDestinationsGql,
  context: ReportingServiceContext,
}
