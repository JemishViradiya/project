//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared-types'

import type { ExfiltrationTypeEventsChartQueryParams, TopEventsQueryParams } from '../dashboard/types'
import type {
  ActiveDevicesResponse,
  ActiveUsersResponse,
  DashboardTopEventsResponse,
  EvidenceLockerInfoResponse,
  ExfiltrtationTypeEventsResponse,
  SensitiveFilesOnEndpointsResponse,
  TotalSensitiveFilesOnEndpointsResponse,
} from './dashboard-types'

export default interface DashboardInterface {
  /**
   * Gets top-events
   * @param reportCategory tab category
   * @param topEventsType
   */
  readTopEvents(reportCategory: string, params: TopEventsQueryParams): Response<DashboardTopEventsResponse>

  /**
   * Gets exfiltration type events
   * @param exfiltrationType
   */
  readExfiltrationTypeEvents(params: ExfiltrationTypeEventsChartQueryParams): Response<ExfiltrtationTypeEventsResponse>

  /**
   * Gets the totalFilesCount, spaceUsed and spaceRemaining for that tenant
   * Response is:
   *  {
   *    totalFilesCount: string,
   *    spaceUsed: string,
   *    spaceRemaining: string
   *  }
   */
  readEvidenceLockerInfo(): Response<EvidenceLockerInfoResponse>

  /**
   * Gets Total Sensitive files on endpoints
   */
  readTotalSensitiveFilesOnEndpoints(): Response<TotalSensitiveFilesOnEndpointsResponse>

  /**
   * Get Number of Active Users
   */
  readNumberActiveUsers(): Response<ActiveUsersResponse>

  /**
   * Get Number of Active Devices
   */
  readNumberActiveDevices(): Response<ActiveDevicesResponse>

  /**
   * Gets Sensitive files on endpoints
   */
  readSensitiveFilesOnEndpoints(reportCategory: string): Response<SensitiveFilesOnEndpointsResponse>
}
