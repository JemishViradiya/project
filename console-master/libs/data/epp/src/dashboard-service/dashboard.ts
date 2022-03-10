import { axiosInstance, dashboardBaseUrl } from '../config.rest'
import type { EppDashboardInterface } from './dashboard-interface'
import type { ThreatEvents, ThreatsByPriority, ThreatStats, TopTenLists, TotalFilesAnalyzed } from './dashboard-types'

class EppDashboard implements EppDashboardInterface {
  getTotalFilesAnalyzed(): Promise<TotalFilesAnalyzed> {
    throw axiosInstance().post(`${dashboardBaseUrl}/GetTotalFilesAnalyzed`)
  }
  getThreatStats(): Promise<ThreatStats> {
    return axiosInstance().post(`${dashboardBaseUrl}/GetThreatStats`)
  }
  getThreatsByPriority(): Promise<ThreatsByPriority> {
    return axiosInstance().post(`${dashboardBaseUrl}/GetThreatsByPriorityStats`)
  }
  getThreatProtectionPercentage(): Promise<number> {
    return axiosInstance().post(`${dashboardBaseUrl}/GetThreatProtectionPercentage`)
  }
  getDeviceProtectionPercentage(): Promise<number> {
    return axiosInstance().post(`${dashboardBaseUrl}/GetDeviceProtectionPercentage`)
  }
  getTopTenLists(): Promise<TopTenLists> {
    return axiosInstance().post(`${dashboardBaseUrl}/GetTopTenLists`)
  }
  getThreatEvents(): Promise<ThreatEvents[]> {
    return axiosInstance().post(`${dashboardBaseUrl}/GetThreatEvents`)
  }
}

const EppDashboardApi = new EppDashboard()

export { EppDashboardApi }
