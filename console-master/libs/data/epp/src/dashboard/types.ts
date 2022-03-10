import type {
  EppDashboardApi,
  EppDashboardMockApi,
  ThreatEvents,
  ThreatsByPriority,
  ThreatStats,
  TopTenLists,
  TotalFilesAnalyzed,
} from '../dashboard-service'

interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

type ApiProvider = typeof EppDashboardApi | typeof EppDashboardMockApi

interface EppDashboardState {
  tasks?: {
    threatStats: Task<ThreatStats>
    totalFilesAnalyzed: Task<TotalFilesAnalyzed>
    threatsByPriority: Task<ThreatsByPriority>
    threatProtectionPercentage: Task<number>
    deviceProtectionPercentage: Task<number>
    topTenLists: Task<TopTenLists>
    threatEvents: Task<ThreatEvents[]>
  }
}

export { ApiProvider, Task, EppDashboardState }
