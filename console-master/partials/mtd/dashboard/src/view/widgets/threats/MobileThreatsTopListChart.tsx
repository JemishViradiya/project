import React, { memo, useMemo } from 'react'

import type { DashboardTime, TopListData } from '@ues-behaviour/dashboard'
import { getDateRangeISOString, TopList } from '@ues-behaviour/dashboard'
import { MobileProtectData, queryTopMobileThreats } from '@ues-data/mtd'
import { useStatefulAsyncQuery } from '@ues-data/shared'
import { getEventTypeItems, MobileAlertGroupBy } from '@ues-mtd/shared'

import { useBackendState } from './hooks/useBackendState'
import { mobileAlertNavigate, useFeatureNavigation } from './hooks/useDashboardNavigate'
import { useStyles } from './styles'

export interface TopListChartProps {
  globalTime: DashboardTime
  eventTypes: MobileProtectData.MobileThreatEventType[] | 'all'
  height: number
  onInteraction?: () => void
}

const LIMIT = 10

function getData(details: MobileProtectData.MobileThreatEventDetail[]): TopListData[] {
  const chartData = []
  for (const detail of details) {
    chartData.push({ label: detail.eventDetail, count: detail.count })
  }
  chartData.sort((a, b) => (a.count > b.count ? 1 : -1))
  return chartData
}

export const MobileThreatsTopListChart: React.FC<TopListChartProps> = memo(({ eventTypes, globalTime }) => {
  const styles = useStyles()
  const featureNavigation = useFeatureNavigation()
  const { startDate, endDate } = useMemo(() => getDateRangeISOString(globalTime), [globalTime])

  const request: MobileProtectData.MobileThreatEventQueryEntry = useMemo(() => {
    const eventTypeItems = getEventTypeItems()
    return {
      query: {
        queryId: 'all',
        startDateTime: startDate,
        endDateTime: endDate,
        eventTypes: eventTypes !== 'all' ? eventTypes : eventTypeItems,
        eventStates: [MobileProtectData.MobileThreatEventState.NEW, MobileProtectData.MobileThreatEventState.RESOLVED],
      },
      limit: LIMIT,
    }
  }, [eventTypes, endDate, startDate])

  const { data: detailsData, error } = useStatefulAsyncQuery(queryTopMobileThreats, {
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
          const isUnsafeUrls =
            eventTypes !== 'all' &&
            eventTypes.length > 0 &&
            eventTypes[0] === MobileProtectData.MobileThreatEventType.UNSAFE_MESSAGE
          mobileAlertNavigate(
            featureNavigation,
            isUnsafeUrls
              ? {
                  detectedStart: startDate,
                  detectedEnd: endDate,
                  ...{ type: eventTypes },
                  groupBy: MobileAlertGroupBy.NONE,
                  status: [MobileProtectData.MobileThreatEventState.NEW, MobileProtectData.MobileThreatEventState.RESOLVED],
                  description: data.label,
                }
              : {
                  detectedStart: startDate,
                  detectedEnd: endDate,
                  ...(eventTypes !== 'all' && { type: eventTypes }),
                  groupBy: MobileAlertGroupBy.DETECTION,
                  status: [MobileProtectData.MobileThreatEventState.NEW, MobileProtectData.MobileThreatEventState.RESOLVED],
                  name: data.label,
                },
          )
        }}
      />
    </div>
  )
})
