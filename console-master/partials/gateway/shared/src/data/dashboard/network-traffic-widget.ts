//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReportingServiceQueryVariables, ReportingServiceResponse } from '@ues-data/gateway'
import { networkTrafficMock, queryNetworkTrafficGql, ReportingServiceContext } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'

import { ReportingReadPermissions } from '../settings/permissions'

export const queryNetworkTraffic: ApolloQuery<
  ReportingServiceResponse<{
    counters: { allowed: number; blocked: number }
  }>,
  ReportingServiceQueryVariables
> = {
  permissions: ReportingReadPermissions,
  mockQueryFn: () => networkTrafficMock,
  query: queryNetworkTrafficGql,
  context: ReportingServiceContext,
}
