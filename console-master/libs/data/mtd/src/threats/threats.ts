// eslint-disable-next-line import/default
import { UesAxiosClient, UesSessionApi } from '@ues-data/shared'

import type { Response } from '../types'
import type ThreatsInterface from './threats-interface'
import type {
  EcsEntityResponse,
  EndpointCounts,
  MobileThreatDeviceDetail,
  MobileThreatEventCount,
  MobileThreatEventDetail,
  MobileThreatEventQuery,
  MobileThreatEventQueryData,
  MobileThreatEventQueryEntry,
  MobileThreatEventSeries,
} from './threats-types'
import { MobileThreatEventType } from './threats-types'

class ThreatsClass implements ThreatsInterface {
  async getMobileEventCounts(request: MobileThreatEventQueryData): Promise<Response<MobileThreatEventCount[]>> {
    return await DashboardAggregationApi.postThreatCount(request.queries)
  }

  async getMobileEventSeries(request: MobileThreatEventQueryData): Promise<Response<MobileThreatEventSeries[]>> {
    return await DashboardAggregationApi.postThreatSeries(request.queries, request.limit)
  }

  async getTopMobileThreats(request: MobileThreatEventQueryEntry): Promise<Response<MobileThreatEventDetail[]>> {
    if (request.query.eventTypes[0] === MobileThreatEventType.UNSAFE_MESSAGE) {
      return await DashboardAggregationApi.postTopUnsafeUrls(request.query, request.limit)
    } else {
      return await DashboardAggregationApi.postTopThreatDetail(request.query, request.limit)
    }
  }

  async getMobileDevicesWithThreats(request: MobileThreatEventQueryData): Promise<Response<MobileThreatEventCount[]>> {
    return DashboardAggregationApi.postThreatDevice(request.queries)
  }

  async getTopMobileDevicesWithThreats(request: MobileThreatEventQueryEntry): Promise<Response<MobileThreatDeviceDetail[]>> {
    return await DashboardAggregationApi.postTopThreatDeviceDetail(request.query, request.limit)
  }

  async getEndpointCounts(): Promise<Response<EndpointCounts>> {
    return await DashboardAggregationApi.getEndpointCounts()
  }

  async getEcsDeviceCount(): Promise<Response<EcsEntityResponse>> {
    return await EntityAggregationApi.getDeviceCount()
  }
}

const DashboardAggregationApi = {
  postThreatCount: async (queries: MobileThreatEventQuery[]) => {
    return await UesAxiosClient().post('/mtd/v1/dashboardaggregation/threat/count', { threatQueries: queries }, {})
  },
  postThreatSeries: async (queries: MobileThreatEventQuery[], limit: number) => {
    return await UesAxiosClient().post(`/mtd/v1/dashboardaggregation/threat/series?max=${limit}`, { threatQueries: queries }, {})
  },
  postTopThreatDetail: async (query: MobileThreatEventQuery, limit: number) => {
    return await UesAxiosClient().post(`/mtd/v1/dashboardaggregation/threat/detail?max=${limit}`, query, {})
  },
  postThreatDevice: async (queries: MobileThreatEventQuery[]) => {
    return await UesAxiosClient().post('/mtd/v1/dashboardaggregation/threat/device', { threatQueries: queries }, {})
  },
  postTopThreatDeviceDetail: async (query: MobileThreatEventQuery, limit: number) => {
    return await UesAxiosClient().post(`/mtd/v1/dashboardaggregation/threat/deviceDetail?max=${limit}`, query, {})
  },
  getEndpointCounts: async () => {
    return await UesAxiosClient().get(`/mtd/v1/dashboardaggregation/os/endpoint/count`, {})
  },
  postTopUnsafeUrls: async (query: MobileThreatEventQuery, limit: number) => {
    return await UesAxiosClient().post(`/mtd/v1/dashboardaggregation/threat/unsafeUrls?max=${limit}`, query, {})
  },
}

const EntityAggregationApi = {
  getDeviceCount: async () => {
    return await UesAxiosClient().get(
      `/platform/v1/entities?query=tenantId=${UesSessionApi.getTenantId()},type=device&offset=0&max=1`,
      {},
    )
  },
}

const Threats = new ThreatsClass()

export { Threats }
export * from './threats-mock'
