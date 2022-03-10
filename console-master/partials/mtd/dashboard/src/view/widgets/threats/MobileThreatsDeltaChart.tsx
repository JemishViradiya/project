import type { TFunction } from 'i18next'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { BarChartData, DashboardTime } from '@ues-behaviour/dashboard'
import { BarChart, ChartHeader, Count, getDateRangeISOString, prevDateOfEqualPeriod } from '@ues-behaviour/dashboard'
import { MobileProtectData, querytMobileEventCounts } from '@ues-data/mtd'
import { useStatefulAsyncQuery } from '@ues-data/shared'
import { getEventTypeItems, MobileAlertGroupBy } from '@ues-mtd/shared'

import { useBackendState } from './hooks/useBackendState'
import { mobileAlertNavigate, useFeatureNavigation } from './hooks/useDashboardNavigate'
import { useStyles } from './styles'

export interface DeltaChartProps {
  globalTime?: DashboardTime
  onInteraction?: () => void
}

interface ResolutionCounts {
  current: number
  previous: number
  unresolved: number
}

function getCounts(rsp: MobileProtectData.Response<MobileProtectData.MobileThreatEventCount[]>): ResolutionCounts {
  if (rsp) {
    return {
      current: rsp.data.find(item => item.queryId === MobileProtectData.ThreatResolution.CURRENT).count,
      previous: rsp.data.find(item => item.queryId === MobileProtectData.ThreatResolution.PREVIOUS).count,
      unresolved: rsp.data.find(item => item.queryId === MobileProtectData.ThreatResolution.UNRESOVED).count,
    }
  } else {
    return { current: 0, previous: 0, unresolved: 0 }
  }
}

function getData(t: TFunction, unresolved: number): BarChartData[] {
  return [{ count: unresolved, label: t('threats.unresolved') }]
}

export const MobileThreatsDeltaChart: React.FC<DeltaChartProps> = ({ globalTime }) => {
  const styles = useStyles()
  const featureNavigation = useFeatureNavigation()
  const { t } = useTranslation(['mtd/common'])

  const { startDate, endDate } = useMemo(() => getDateRangeISOString(globalTime), [globalTime])
  const prevDate = useMemo(() => {
    const timeRange = { startDate: new Date(startDate), endDate: new Date(endDate) }
    return prevDateOfEqualPeriod(timeRange)
  }, [endDate, startDate])

  const request: MobileProtectData.MobileThreatEventQueryData = useMemo(() => {
    const eventTypeItems = getEventTypeItems()
    return {
      queries: [
        {
          queryId: MobileProtectData.ThreatResolution.CURRENT,
          startDateTime: startDate,
          endDateTime: endDate,
          eventTypes: eventTypeItems,
          eventStates: [MobileProtectData.MobileThreatEventState.NEW, MobileProtectData.MobileThreatEventState.RESOLVED],
        },
        {
          queryId: MobileProtectData.ThreatResolution.PREVIOUS,
          startDateTime: prevDate.toISOString(),
          endDateTime: startDate,
          eventTypes: eventTypeItems,
          eventStates: [MobileProtectData.MobileThreatEventState.NEW, MobileProtectData.MobileThreatEventState.RESOLVED],
        },
        {
          queryId: MobileProtectData.ThreatResolution.UNRESOVED,
          startDateTime: startDate,
          endDateTime: endDate,
          eventTypes: eventTypeItems,
          eventStates: [MobileProtectData.MobileThreatEventState.NEW],
        },
      ],
      limit: 3,
    }
  }, [endDate, prevDate, startDate])

  const { data: deltaData, error } = useStatefulAsyncQuery(querytMobileEventCounts, {
    variables: request,
  })

  useBackendState(error)

  const { current, previous, unresolved } = getCounts(deltaData)

  // const chartHeight = height - theme.spacing(24)

  return (
    <div className={styles.chartContainer}>
      <ChartHeader className={styles.chartHeader}>
        <div>
          <Count
            count={current}
            description={t('dashboard.totalThreatsDetectedDescription')}
            isIncreaseGood={false}
            showChange={true}
            prevCount={previous}
            onCountClick={() =>
              mobileAlertNavigate(featureNavigation, {
                detectedStart: startDate,
                detectedEnd: endDate,
                status: [MobileProtectData.MobileThreatEventState.NEW, MobileProtectData.MobileThreatEventState.RESOLVED],
                groupBy: MobileAlertGroupBy.NONE,
              })
            }
          />
        </div>
        <div className={styles.chartExtContainer}>
          <BarChart data={deltaData ? getData(t, unresolved) : []} />
        </div>
      </ChartHeader>
    </div>
  )
}
