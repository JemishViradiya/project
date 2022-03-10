//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReportingServiceQueryVariables, ReportingServiceTunnelAggResponse } from '@ues-data/gateway'
import { aggregatedNetworkTrafficMock, queryAggregatedNetworkTrafficGql, ReportingServiceContext } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'

import { EventsPermissions } from './permissions'

export const queryAggregatedNetworkTraffic: ApolloQuery<ReportingServiceTunnelAggResponse, ReportingServiceQueryVariables> = {
  permissions: EventsPermissions,
  mockQueryFn: ({ field }) => aggregatedNetworkTrafficMock[field],
  query: queryAggregatedNetworkTrafficGql,
  context: ReportingServiceContext,
}
