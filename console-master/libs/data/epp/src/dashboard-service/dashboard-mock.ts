import type { EppDashboardInterface } from './dashboard-interface'
import {
  DeviceProtectionPercentageMock,
  ThreatEventsMock,
  ThreatProtectionPercentageMock,
  ThreatsByPriorityMock,
  ThreatStatsMock,
  TopTenListsMock,
  TotalFilesAnalyzedMock,
} from './dashboard-mock.data'
import type { ThreatEvents, ThreatsByPriority, ThreatStats, TopTenLists, TotalFilesAnalyzed } from './dashboard-types'

class EppDashboardMock implements EppDashboardInterface {
  getTotalFilesAnalyzed(): Promise<TotalFilesAnalyzed> {
    return Promise.resolve(TotalFilesAnalyzedMock)
  }
  getThreatStats(): Promise<ThreatStats> {
    return Promise.resolve(ThreatStatsMock)
  }
  getThreatsByPriority(): Promise<ThreatsByPriority> {
    return Promise.resolve(ThreatsByPriorityMock)
  }
  getThreatProtectionPercentage(): Promise<number> {
    return Promise.resolve(ThreatProtectionPercentageMock)
  }
  getDeviceProtectionPercentage(): Promise<number> {
    return Promise.resolve(DeviceProtectionPercentageMock)
  }
  getTopTenLists(): Promise<TopTenLists> {
    return Promise.resolve(TopTenListsMock)
  }
  getThreatEvents(): Promise<ThreatEvents[]> {
    return Promise.resolve(ThreatEventsMock)
  }
}

const EppDashboardMockApi = new EppDashboardMock()

export { EppDashboardMockApi }
