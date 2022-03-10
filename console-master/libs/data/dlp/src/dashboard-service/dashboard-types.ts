//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { DashboardTime } from '@ues-data/dashboard'

export enum DashboardWidgetType {
  TopEventsBy = 'top-events-by',
  ExfiltrationEvents = 'exfiltration-events',
  TotalSensitiveData = 'total-sensitive-data',
  SensitiveDataEndpoints = 'sensitive-data-endpoints',
  EvidenceLockerFiles = 'evidence-locker-files',
  ConnectedUsers = 'connected-users',
  ConnectedFiles = 'connected-files',
  ConnectedDevices = 'connected-devices',
  TopEventsByDestination = 'top-events-by-destination',
}

export enum ReportingServiceInterval {
  Minute = 'Minute',
  Hour = 'Hour',
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Quarter = 'Quarter',
  Year = 'Year',
}

export enum HoursInterval {
  last24Hours = 24,
  last7Days = 168,
  last30Days = 720,
}
export interface ExfiltrationWidgetChartProps {
  dateRange: { startDate: string; endDate: string }
  dataInterval: ReportingServiceInterval
  chartHeight: number
  globalTime: DashboardTime
}

export type DashboardTopEvents = {
  reportCategory: string
  maxRecords: number
  startTime: string | number
  stopTime: string | number
}

export type TopEventItem = {
  label: string
  count: number
}

export type DashboardTopEventsResponse = {
  key: string
  items: Array<TopEventItem>
}

export enum ExfiltrationTypeEventsBy {
  Email = 'EMAIL',
  Browser = 'BROWSER',
  RemovableMedia = 'REMOVABLE_MEDIA',
}

export type SensitiveFileItem = {
  item: string
  count: number
}

export type ExfiltrationTypeEvent = {
  key: number
  count: number
}

type ExfiltrtationTypeEventsData = {
  [key in ExfiltrationTypeEventsBy]?: ExfiltrationTypeEvent[]
}

export type ExfiltrtationTypeEventsResponse = {
  view: ExfiltrtationTypeEventsData
}

export enum EvidenceLockerInfoKeys {
  TotalFileUsed = 'totalFilesCount',
  TotalSpaceUsed = 'spaceUsed',
  SpaceRemaining = 'spaceRemaining',
}

export enum SensitiveFilesReportCategory {
  POLICY = 'POLICY',
  FILE_TYPE = 'FILE_TYPE',
  INFO_TYPE = 'INFO_TYPE',
  DATA_ENTITY = 'DATA_ENTITY',
}

export type EvidenceLockerInfoResponse = {
  [key in EvidenceLockerInfoKeys]?: string
}

export type TotalSensitiveFilesOnEndpointsResponse = {
  totalSensitiveCount: number
}

export type SensitiveFilesOnEndpointsResponse = {
  key: keyof typeof SensitiveFilesReportCategory
  items: SensitiveFileItem[]
}

export type ActiveUsersResponse = {
  activeUsers: number
}

export type ActiveDevicesResponse = {
  activeEndpoints: number
}
