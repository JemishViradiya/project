//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type {
  ReportingServiceNetworkRouteType,
  ReportingServiceQueryVariables,
  ReportingServiceResponse,
  ReportingServiceTunnelAggData,
} from '@ues-data/gateway'
import { aggregatedTopUsersBandwidthMock, queryTopUsersBandwidthGql, ReportingServiceContext } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'

import { ReportingReadPermissions } from '../settings/permissions'

type TopUsersBandwidthResponse = ReportingServiceResponse<
  Record<ReportingServiceNetworkRouteType | 'all', ReportingServiceTunnelAggData>
>

export const queryTopUsersBandwidth: ApolloQuery<TopUsersBandwidthResponse, ReportingServiceQueryVariables> = {
  permissions: ReportingReadPermissions,
  mockQueryFn: () => aggregatedTopUsersBandwidthMock,
  query: queryTopUsersBandwidthGql,
  context: ReportingServiceContext,
}
