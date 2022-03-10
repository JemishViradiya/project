import { EppDashboardData } from '@ues-data/epp'
import { useStatefulReduxQuery } from '@ues-data/shared'

const useEppDashboardDataSource = () => {
  const { error: threatStatsError, loading: threatStatsLoading, data: threatStats, refetch, fetchMore } = useStatefulReduxQuery(
    EppDashboardData.fetchThreatStats,
  )

  const { error: topTenListsError, loading: topTenListsLoading, data: topTenListsData } = useStatefulReduxQuery(
    EppDashboardData.fetchTopTenLists,
  )

  const {
    error: threatProtectionPercentageError,
    loading: threatProtectionPercentageLoading,
    data: threatProtectionPercentage,
  } = useStatefulReduxQuery(EppDashboardData.fetchThreatProtectionPercentage)

  const {
    error: deviceProtectionPercentageError,
    loading: deviceProtectionPercentageLoading,
    data: deviceProtectionPercentage,
  } = useStatefulReduxQuery(EppDashboardData.fetchDeviceProtectionPercentage)

  const {
    error: totalFilesAnalyzedError,
    loading: totalFilesAnalyzedLoading,
    data: totalFilesAnalyzedData,
  } = useStatefulReduxQuery(EppDashboardData.fetchTotalFilesAnalyzed)

  const { error: threatsByPriorityError, loading: threatsByPriorityLoading, data: threatsByPriorityData } = useStatefulReduxQuery(
    EppDashboardData.fetchThreatsByPriority,
  )

  const { error: threatEventsError, loading: threatEventsLoading, data: threatEventsData } = useStatefulReduxQuery(
    EppDashboardData.fetchThreatEvents,
  )

  return {
    // threat stats
    threatStats,
    threatStatsLoading,
    threatStatsError,
    // threat protection percentage
    threatProtectionPercentageError,
    threatProtectionPercentageLoading,
    threatProtectionPercentage,
    // device protection percentage
    deviceProtectionPercentageError,
    deviceProtectionPercentageLoading,
    deviceProtectionPercentage,
    // top ten lists
    topTenListsError,
    topTenListsLoading,
    topTenListsData,
    // total files analyzed
    totalFilesAnalyzedError,
    totalFilesAnalyzedLoading,
    totalFilesAnalyzedData,
    // threats by priority
    threatsByPriorityError,
    threatsByPriorityLoading,
    threatsByPriorityData,
    // threat events
    threatEventsError,
    threatEventsLoading,
    threatEventsData,
    refetch,
    fetchMore,
  }
}

export default useEppDashboardDataSource
