//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReportingServiceQueryVariables, ReportingServiceResponse } from '@ues-data/gateway'
import { queryTotalActiveUsersGql, ReportingServiceContext, totalActiveUsersMock } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'

import { ReportingReadPermissions } from '../settings/permissions'

export const queryTotalActiveUsers: ApolloQuery<
  ReportingServiceResponse<{
    counters: { users: number }
  }>,
  ReportingServiceQueryVariables
> = {
  permissions: ReportingReadPermissions,
  mockQueryFn: () => totalActiveUsersMock,
  query: queryTotalActiveUsersGql,
  context: ReportingServiceContext,
}
