//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import type { ReportingServiceQueryVariables, ReportingServiceTunnelAggResponse } from '@ues-data/gateway'
import { queryTopBlockedCategoriesGql, ReportingServiceContext, topBlockedCategoriesWidgetMock } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'

import { ReportingReadPermissions } from '../settings/permissions'

export const queryTopBlockedCategories: ApolloQuery<ReportingServiceTunnelAggResponse, ReportingServiceQueryVariables> = {
  permissions: ReportingReadPermissions,
  mockQueryFn: () => topBlockedCategoriesWidgetMock,
  query: queryTopBlockedCategoriesGql,
  context: ReportingServiceContext,
}
