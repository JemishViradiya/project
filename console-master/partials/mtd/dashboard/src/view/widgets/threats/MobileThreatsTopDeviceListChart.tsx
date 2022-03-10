import React, { memo, useMemo } from 'react'

import type { ChartProps, EnhancedChartEntry, TopListData } from '@ues-behaviour/dashboard'
import { getDateRangeISOString, TopList } from '@ues-behaviour/dashboard'
import { MobileProtectData, queryTopMobileDeviceThreats } from '@ues-data/mtd'
import { Permission, usePermissions, useStatefulAsyncQuery } from '@ues-data/shared'
import { getEventTypeItems } from '@ues-mtd/shared'

import { useBackendState } from './hooks/useBackendState'
import { mobileDevicesAlertsNavigate, useFeatureNavigation } from './hooks/useDashboardNavigate'
import { useStyles } from './styles'

const LIMIT = 10

function getData(details: MobileProtectData.MobileThreatDeviceDetail[]): EnhancedChartEntry<TopListData>[] {
  const chartData = []
  for (const detail of details) {
    chartData.push({
      label: detail.deviceModelName,
      count: detail.count,
      secondary: detail.userDisplayName,
      metadata: { deviceId: detail.deviceId, endpointIds: detail.endpointIds },
    })
  }
  chartData.sort((a, b) => (a.count > b.count ? 1 : -1))
  return chartData
}

export const MobileThreatsTopDeviceListChart: React.FC<ChartProps> = memo(({ globalTime }) => {
  const styles = useStyles()
  const featureNavigation = useFeatureNavigation()
  const { hasPermission } = usePermissions()
  const { startDate, endDate } = useMemo(() => getDateRangeISOString(globalTime), [globalTime])

  const request: MobileProtectData.MobileThreatEventQueryEntry = useMemo(() => {
    const eventTypeItems = getEventTypeItems()
    return {
      query: {
        queryId: 'all',
        startDateTime: startDate,
        endDateTime: endDate,
        eventTypes: eventTypeItems,
        eventStates: [
          MobileProtectData.MobileThreatEventState.NEW,
          MobileProtectData.MobileThreatEventState.RESOLVED,
          MobileProtectData.MobileThreatEventState.IGNORED,
        ],
      },
      limit: LIMIT,
    }
  }, [endDate, startDate])

  const { data: detailsData, error } = useStatefulAsyncQuery(queryTopMobileDeviceThreats, {
    variables: request,
  })

  useBackendState(error, detailsData?.data.length === 0)

  const chartData = detailsData ? getData(detailsData.data) : []

  return (
    <div className={styles.chartListContainer}>
      <TopList
        data={chartData}
        options={{ showTooltip: false }}
        onInteraction={data => {
          if (hasPermission(Permission.ECS_DEVICES_READ)) {
            mobileDevicesAlertsNavigate(featureNavigation, data.metadata.endpointIds[0], {
              status: '',
              detectedStart: startDate,
              detectedEnd: endDate,
            })
          }
        }}
      />
    </div>
  )
})
