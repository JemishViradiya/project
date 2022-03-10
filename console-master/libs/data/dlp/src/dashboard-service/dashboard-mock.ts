import type { Response } from '@ues-data/shared-types'

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
import { evidenceLockerInfo } from './evidence-locker-info-mock-data'
import { seriesDataMockGenerator } from './exfiltraion-events-mock-data'
import { sensitiveEndpointsMockData } from './sensitive-endpoints-mock-data'
import { topEventsGeneralMockData } from './top-events-mock-data'

class DashboardDataMockClass implements DashboardInterface {
  readTopEvents(reportCategory: string, params: TopEventsQueryParams): Response<DashboardTopEventsResponse> {
    const dashboardTopEventsResponse: DashboardTopEventsResponse = topEventsGeneralMockData.find(
      element => element.key === reportCategory,
    )
    return Promise.resolve({ data: dashboardTopEventsResponse })
  }

  readExfiltrationTypeEvents(params: ExfiltrationTypeEventsChartQueryParams): Response<ExfiltrtationTypeEventsResponse> {
    return Promise.resolve({ data: seriesDataMockGenerator(params) })
  }

  readEvidenceLockerInfo(): Response<EvidenceLockerInfoResponse> {
    return Promise.resolve({ data: evidenceLockerInfo })
  }

  readTotalSensitiveFilesOnEndpoints(): Response<TotalSensitiveFilesOnEndpointsResponse> {
    return Promise.resolve({ data: TotalSensitiveFilesOnEndpointsMockData })
  }

  readSensitiveFilesOnEndpoints(reportCategory: string): Response<SensitiveFilesOnEndpointsResponse> {
    const sensitiveFilesOnEndpointsResponse: SensitiveFilesOnEndpointsResponse = sensitiveEndpointsMockData.find(
      element => element.key === reportCategory,
    )
    return Promise.resolve({ data: sensitiveFilesOnEndpointsResponse })
  }

  readNumberActiveUsers(): Response<ActiveUsersResponse> {
    return Promise.resolve({ data: numberOfActiveUsers })
  }
  readNumberActiveDevices(): Response<ActiveDevicesResponse> {
    return Promise.resolve({ data: numberOfActiveDevices })
  }
}

const DashboardTopEventsMockApi = new DashboardDataMockClass()
export { DashboardTopEventsMockApi }

export const getRandomData = (hours, max?) => {
  let startTime = Date.now()
  const times = []
  for (let i = 0; i < hours; i++) {
    times.push(new Date((startTime -= 3600000)).toISOString())
  }
  function getDataValue(max = 50) {
    return Math.floor(Math.random() * max * 1)
  }

  const data = []
  times.forEach(function (t) {
    data.push({ value: [t, getDataValue(max)] })
  })

  return data
}

export const TotalSensitiveFilesOnEndpointsMockData: TotalSensitiveFilesOnEndpointsResponse = {
  totalSensitiveCount: 28304,
}

export const numberOfActiveUsers: ActiveUsersResponse = {
  activeUsers: 3507,
}

export const numberOfActiveDevices: ActiveDevicesResponse = {
  activeEndpoints: 3498,
}
