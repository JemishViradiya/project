//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReportingServiceQueryVariables, ReportingServiceTunnelAggResponse } from '@ues-data/gateway'
import { appliedPoliciesMock, queryAppliedPoliciesGql, ReportingServiceContext } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'

import { ReportingReadPermissions } from '../settings/permissions'

export const queryAppliedPolicies: ApolloQuery<ReportingServiceTunnelAggResponse, ReportingServiceQueryVariables> = {
  permissions: ReportingReadPermissions,
  mockQueryFn: ({ filter: { alertPolicyType } }) => appliedPoliciesMock[alertPolicyType],
  query: queryAppliedPoliciesGql,
  context: ReportingServiceContext,
}
