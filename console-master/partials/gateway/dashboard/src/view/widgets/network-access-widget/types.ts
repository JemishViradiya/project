//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { DashboardTime } from '@ues-behaviour/dashboard'
import type { ReportingServiceCount, ReportingServiceNetworkRouteType, ReportingServiceResponse } from '@ues-data/gateway'

export type ReportingServiceEventsRouteType = ReportingServiceResponse<{
  allowed: ReportingServiceCount[]
  blocked: ReportingServiceCount[]
}>

export interface EventsReportingCountData {
  allowedTraffic: [string | number, string | number][]
  blockedTraffic: [string | number, string | number][]
}

export interface BytesReportingCountData {
  uploaded: [string | number, string | number][]
  downloaded: [string | number, string | number][]
}

export interface NetworkAccessWidgetChartProps<TData> {
  chartHeight: number
  data: TData
  globalTime: DashboardTime
  startDate: string
  endDate: string
  networkRouteType: ReportingServiceNetworkRouteType
}
