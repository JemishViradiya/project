//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReportingServiceQueryVariables, ReportingServiceTunnelTimeAggResponse } from '@ues-data/gateway'
import { networkAccessTrafficSummaryMock, queryNetworkAccessTrafficSummaryGql, ReportingServiceContext } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'

import { ReportingReadPermissions } from '../settings/permissions'

export const queryNetworkAccessTrafficSummary: ApolloQuery<
  ReportingServiceTunnelTimeAggResponse,
  ReportingServiceQueryVariables
> = {
  permissions: ReportingReadPermissions,
  mockQueryFn: ({ interval, filter: { networkRoute } }) => networkAccessTrafficSummaryMock[networkRoute][interval],
  query: queryNetworkAccessTrafficSummaryGql,
  context: ReportingServiceContext,
}
