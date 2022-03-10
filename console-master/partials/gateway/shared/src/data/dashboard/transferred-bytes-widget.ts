//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReportingServiceQueryVariables, ReportingServiceResponse, ReportingServiceTrafficEntity } from '@ues-data/gateway'
import { queryTransferredBytesGql, ReportingServiceContext, transferredBytesMock } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'

import { ReportingReadPermissions } from '../settings/permissions'

export const queryTransferredBytes: ApolloQuery<
  ReportingServiceResponse<{ traffic: ReportingServiceTrafficEntity }>,
  ReportingServiceQueryVariables
> = {
  permissions: ReportingReadPermissions,
  mockQueryFn: () => transferredBytesMock,
  query: queryTransferredBytesGql,
  context: ReportingServiceContext,
}
