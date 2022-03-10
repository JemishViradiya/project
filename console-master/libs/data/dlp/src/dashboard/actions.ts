/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type {
  ActiveDevicesResponse,
  ActiveUsersResponse,
  DashboardTopEventsResponse,
  EvidenceLockerInfoResponse,
  TotalSensitiveFilesOnEndpointsResponse,
} from '../dashboard-service/dashboard-types'
import type { ApiProvider, ExfiltrationTypeEventsChartQueryParams, TopEventsQueryParams } from './types'
import { DashboardActionType } from './types'

//get top events
export const getTopEventsStart = (
  payload: { reportCategory: string; queryParams: TopEventsQueryParams },
  apiProvider: ApiProvider,
) => ({
  type: DashboardActionType.GetTopEventsStart,
  payload: { ...payload, apiProvider },
})

export const getTopEventsSuccess = (payload: any) => ({
  type: DashboardActionType.GetTopEventsSuccess,
  payload,
})

export const getTopEventsError = (error: Error) => ({
  type: DashboardActionType.GetTopEventsError,
  payload: { error },
})

//get exfiltration events
export const fetchExfiltrationEventsStart = (
  payload: { queryParams: ExfiltrationTypeEventsChartQueryParams },
  apiProvider: ApiProvider,
) => ({
  type: DashboardActionType.FetchExfiltrationEventsStart,
  payload: { ...payload, apiProvider },
})

export const fetchExfiltrationEventsSuccess = (payload: DashboardTopEventsResponse) => ({
  type: DashboardActionType.FetchExfiltrationEventsSuccess,
  payload,
})

export const fetchExfiltrationEventsError = (error: Error) => ({
  type: DashboardActionType.FetchExfiltrationEventsError,
  payload: { error },
})

//get evidence locker info
export const getEvidenceLockerInfoStart = (apiProvider: ApiProvider) => ({
  type: DashboardActionType.GetEvidenceLockerInfoStart,
  payload: { apiProvider },
})

export const getEvidenceLockerInfoSuccess = (payload: EvidenceLockerInfoResponse) => ({
  type: DashboardActionType.GetEvidenceLockerInfoSuccess,
  payload,
})

export const getEvidenceLockerInfoError = (error: Error) => ({
  type: DashboardActionType.GetEvidenceLockerInfoError,
  payload: { error },
})

//get Total Sensitive files on endpoints
export const getTotalSensitiveFilesOnEndpointsStart = (apiProvider: ApiProvider) => ({
  type: DashboardActionType.GetTotalSensitiveFilesOnEndpointsStart,
  payload: { apiProvider },
})

export const getTotalSensitiveFilesOnEndpointsSuccess = (payload: TotalSensitiveFilesOnEndpointsResponse) => ({
  type: DashboardActionType.GetTotalSensitiveFilesOnEndpointsSuccess,
  payload,
})

export const getTotalSensitiveFilesOnEndpointsError = (error: Error) => ({
  type: DashboardActionType.GetTotalSensitiveFilesOnEndpointsError,
  payload: { error },
})

//get Number of Active Users
export const getNumberActiveUsersStart = (apiProvider: ApiProvider) => ({
  type: DashboardActionType.GetNumberActiveUsersStart,
  payload: { apiProvider },
})

export const getNumberActiveUsersSuccess = (payload: ActiveUsersResponse) => ({
  type: DashboardActionType.GetNumberActiveUsersSuccess,
  payload,
})

export const getNumberActiveUsersError = (error: Error) => ({
  type: DashboardActionType.GetNumberActiveUsersError,
  payload: { error },
})

//get Number of Active Devices
export const getNumberActiveDevicesStart = (apiProvider: ApiProvider) => ({
  type: DashboardActionType.GetNumberActiveDevicesStart,
  payload: { apiProvider },
})

export const getNumberActiveDevicesSuccess = (payload: ActiveDevicesResponse) => ({
  type: DashboardActionType.GetNumberActiveDevicesSuccess,
  payload,
})

export const getNumberActiveDevicesError = (error: Error) => ({
  type: DashboardActionType.GetNumberActiveDevicesError,
  payload: { error },
})

//get Sensitive files on endpoints
export const getSensitiveFilesOnEndpointsStart = (payload: { reportCategory: string }, apiProvider: ApiProvider) => ({
  type: DashboardActionType.GetSensitiveFilesOnEndpointsStart,
  payload: { ...payload, apiProvider },
})

export const getSensitiveFilesOnEndpointsSuccess = (payload: TotalSensitiveFilesOnEndpointsResponse) => ({
  type: DashboardActionType.GetSensitiveFilesOnEndpointsSuccess,
  payload,
})

export const getSensitiveFilesOnEndpointsError = (error: Error) => ({
  type: DashboardActionType.GetSensitiveFilesOnEndpointsError,
  payload: { error },
})
