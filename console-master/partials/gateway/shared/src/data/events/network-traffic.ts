//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReportingServiceQueryVariables, ReportingServiceTunnelEventsResponse } from '@ues-data/gateway'
import { eventsNetworkTrafficMock, queryEventsNetworkTrafficGql, ReportingServiceContext } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'

import { EventsPermissions } from './permissions'

export const queryEventsNetworkTraffic: ApolloQuery<ReportingServiceTunnelEventsResponse, ReportingServiceQueryVariables> = {
  permissions: EventsPermissions,
  mockQueryFn: () => eventsNetworkTrafficMock,
  query: queryEventsNetworkTrafficGql,
  context: ReportingServiceContext,
}
