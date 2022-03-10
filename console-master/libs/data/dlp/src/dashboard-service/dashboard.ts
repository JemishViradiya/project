//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared-types'

import { analyticsBaseUrl, axiosInstance, fileBaseUrl, fileInventoryBaseUrl, riscScoreBaseUrl } from '../config.rest'
import type { ExfiltrationTypeEventsChartQueryParams, TopEventsQueryParams } from '../dashboard/types'
import type DashboardInterface from './dashboard-interface'
import type {
  ActiveDevicesResponse,
  ActiveUsersResponse,
  DashboardTopEventsResponse,
  EvidenceLockerInfoResponse,
  ExfiltrtationTypeEventsResponse,
  SensitiveFilesOnEndpointsResponse,
  TotalSensitiveFilesOnEndpointsResponse,
} from './dashboard-types'

export const makeTopEventsEndpointUrl = (queryPart?: string): string => `${analyticsBaseUrl}/topEvents/${queryPart}`
export const makeTimeEventsEndpointUrl = () => `${analyticsBaseUrl}/events/`
export const makeEvidenceLockerInfoUrl = () => `${fileBaseUrl}/fileStorage/`
export const makeFileInventoryTotalEndpointUrl = () => `${fileInventoryBaseUrl}/totalSensitiveCount/`
export const makeFileInventoryEndpointUrl = (param: string, queryPart?: string) => `${fileInventoryBaseUrl}/${param}/${queryPart}`
export const makeRiscScoreEndpointUrl = (urlPart: string) => `${riscScoreBaseUrl}/${urlPart}/count`

class DashboardDlpApiClass implements DashboardInterface {
  readTopEvents(reportCategory: string, params: TopEventsQueryParams): Response<DashboardTopEventsResponse> {
    return axiosInstance().get(makeTopEventsEndpointUrl(`${reportCategory}`), {
      params: params,
    })
  }

  readExfiltrationTypeEvents(params: ExfiltrationTypeEventsChartQueryParams): Response<ExfiltrtationTypeEventsResponse> {
    return axiosInstance().get(makeTimeEventsEndpointUrl(), {
      params: params,
    })
  }

  readEvidenceLockerInfo(): Response<EvidenceLockerInfoResponse> {
    return axiosInstance().get(makeEvidenceLockerInfoUrl())
  }

  readTotalSensitiveFilesOnEndpoints(): Response<TotalSensitiveFilesOnEndpointsResponse> {
    return axiosInstance().get(makeFileInventoryTotalEndpointUrl())
  }

  readSensitiveFilesOnEndpoints(reportCategory: string): Response<SensitiveFilesOnEndpointsResponse> {
    return axiosInstance().get(makeFileInventoryEndpointUrl('sensitiveCount', `${reportCategory}`))
  }

  readNumberActiveUsers(): Response<ActiveUsersResponse> {
    return axiosInstance().get(makeRiscScoreEndpointUrl('user'))
  }
  readNumberActiveDevices(): Response<ActiveDevicesResponse> {
    return axiosInstance().get(makeRiscScoreEndpointUrl('endpoint'))
  }
}

const DashboardDlpApi = new DashboardDlpApiClass()

export { DashboardDlpApi }
