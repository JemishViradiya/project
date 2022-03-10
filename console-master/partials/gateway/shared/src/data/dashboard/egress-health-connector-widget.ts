//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { EgressHealthConnectorEvent, ReportingServiceQueryVariables, ReportingServiceResponse } from '@ues-data/gateway'
import { egressHealthConnectorMock, queryEgressHealthConnectorGql, ReportingServiceContext } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'
import { Permission } from '@ues-data/shared'

export const queryEgressHealthConnector: ApolloQuery<
  ReportingServiceResponse<{ conStates: EgressHealthConnectorEvent[] }>,
  ReportingServiceQueryVariables
> = {
  permissions: new Set([Permission.BIG_REPORTING_READ, Permission.BIG_TENANT_READ]),
  mockQueryFn: () => egressHealthConnectorMock,
  query: queryEgressHealthConnectorGql,
  context: ReportingServiceContext,
}
