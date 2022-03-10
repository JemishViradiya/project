/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type {
  ActiveDevicesResponse,
  ActiveUsersResponse,
  DashboardDlpApi,
  DashboardTopEventsMockApi,
  DashboardTopEventsResponse,
  EvidenceLockerInfoResponse,
  ExfiltrtationTypeEventsResponse,
  SensitiveFilesOnEndpointsResponse,
  TotalSensitiveFilesOnEndpointsResponse,
} from '../dashboard-service'

export type ApiProvider = typeof DashboardDlpApi | typeof DashboardTopEventsMockApi

export const DashboardReduxSlice = 'app.dlp.dashboard'

export interface ExfiltrationTypeEventsChartQueryParams {
  interval: string
  startTime: number
  stopTime: number
}

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export interface TopEventsQueryParams {
  maxRecords: number
  startTime: string | number
  stopTime: string | number
}

export enum TaskId {
  GetTopEvents = 'getTopEvents',
  ExfiltrationTypeEvents = 'exfiltrationTypeEvents',
  EvidenceLockerInfo = 'evidenceLockerInfo',
  GetTotalSensitiveFilesOnEndpoints = 'getTotalSensitiveFilesOnEndpoints',
  GetSensitiveFilesOnEndpoints = 'getSensitiveFilesOnEndpoints',
  GetNumberActiveDevices = 'getNumberActiveDevices',
  GetNumberActiveUsers = 'getNumberActiveUsers',
}

export interface DashboardState {
  tasks?: {
    getTopEvents: Task<DashboardTopEventsResponse>
    exfiltrationTypeEvents: Task<ExfiltrtationTypeEventsResponse>
    evidenceLockerInfo: Task<EvidenceLockerInfoResponse>
    getTotalSensitiveFilesOnEndpoints: Task<TotalSensitiveFilesOnEndpointsResponse>
    getSensitiveFilesOnEndpoints: Task<SensitiveFilesOnEndpointsResponse>
    getNumberActiveDevices: Task<ActiveDevicesResponse>
    getNumberActiveUsers: Task<ActiveUsersResponse>
  }
}

export const DashboardActionType = {
  GetTopEventsStart: `${DashboardReduxSlice}/get-top-events-start`,
  GetTopEventsError: `${DashboardReduxSlice}/get-top-events-error`,
  GetTopEventsSuccess: `${DashboardReduxSlice}/get-top-events-success`,

  FetchExfiltrationEventsStart: `${DashboardReduxSlice}/fetch-exfiltration-events-start`,
  FetchExfiltrationEventsError: `${DashboardReduxSlice}/fetch-exfiltration-events-error`,
  FetchExfiltrationEventsSuccess: `${DashboardReduxSlice}/fetch-exfiltration-events-success`,

  GetEvidenceLockerInfoStart: `${DashboardReduxSlice}/get-evidence-locker-info-start`,
  GetEvidenceLockerInfoError: `${DashboardReduxSlice}/get-evidence-locker-info-error`,
  GetEvidenceLockerInfoSuccess: `${DashboardReduxSlice}/get-evidence-locker-info-success`,

  GetTotalSensitiveFilesOnEndpointsStart: `${DashboardReduxSlice}/get-total-sensitive-files-on-endpoints-start`,
  GetTotalSensitiveFilesOnEndpointsError: `${DashboardReduxSlice}/get-total-sensitive-files-on-endpoints-error`,
  GetTotalSensitiveFilesOnEndpointsSuccess: `${DashboardReduxSlice}/get-total-sensitive-files-on-endpoints-success`,

  GetSensitiveFilesOnEndpointsStart: `${DashboardReduxSlice}/get-sensitive-files-on-endpoints-start`,
  GetSensitiveFilesOnEndpointsError: `${DashboardReduxSlice}/get-sensitive-files-on-endpoints-error`,
  GetSensitiveFilesOnEndpointsSuccess: `${DashboardReduxSlice}/get-sensitive-files-on-endpoints-success`,

  GetNumberActiveDevicesStart: `${DashboardReduxSlice}/get-number-active-devices-start`,
  GetNumberActiveDevicesError: `${DashboardReduxSlice}/get-number-active-devices-error`,
  GetNumberActiveDevicesSuccess: `${DashboardReduxSlice}/get-number-active-devices-success`,

  GetNumberActiveUsersStart: `${DashboardReduxSlice}/get-number-active-users-start`,
  GetNumberActiveUsersError: `${DashboardReduxSlice}/get-number-active-users-error`,
  GetNumberActiveUsersSuccess: `${DashboardReduxSlice}/get-number-active-users-success`,
}

// eslint-disable-next-line no-redeclare
export type DashboardActionType = string
