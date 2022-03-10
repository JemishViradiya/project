//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReportingServiceQueryVariables, ReportingServiceTunnelAggResponse } from '@ues-data/gateway'
import { queryTLSVersionsGql, ReportingServiceContext, tlsVersionsMock } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'

import { ReportingReadPermissions } from '../settings/permissions'

export const queryTLSVersions: ApolloQuery<ReportingServiceTunnelAggResponse, ReportingServiceQueryVariables> = {
  permissions: ReportingReadPermissions,
  mockQueryFn: () => tlsVersionsMock,
  query: queryTLSVersionsGql,
  context: ReportingServiceContext,
}
