import type { TFunction } from 'i18next'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { BarChartData, DashboardTime, EnhancedChartEntry } from '@ues-behaviour/dashboard'
import { BarChart, ChartHeader, getDateRangeISOString, TotalCount, WidgetTabs } from '@ues-behaviour/dashboard'
import { MobileProtectData, querytMobileEventCounts } from '@ues-data/mtd'
import { FeatureName, FeaturizationApi, useStatefulAsyncQuery } from '@ues-data/shared'
import { MobileAlertGroupBy } from '@ues-mtd/shared'

import { useBackendState } from './hooks/useBackendState'
import { mobileAlertNavigate, useFeatureNavigation } from './hooks/useDashboardNavigate'
import { useStyles } from './styles'

export interface BarChartProps {
  id: string
  category: MobileProtectData.MobileThreatEventCategory
  globalTime: DashboardTime
  onInteraction?: () => void
  eventStates?: MobileProtectData.MobileThreatEventState[]
}

function getData(
  t: TFunction,
  mobileThreatEventCount: MobileProtectData.MobileThreatEventCount[],
): EnhancedChartEntry<BarChartData>[] {
  return mobileThreatEventCount.map(element => ({
    count: element.count,
    label: t('threats.' + element.queryId),
    metadata: { key: element.queryId },
  }))
}

function getTotal(mobileThreatEventCount: MobileProtectData.MobileThreatEventCount[]): number {
  let total = 0
  mobileThreatEventCount.forEach(element => (total += element.count))
  return total
}

const MobileThreatsBarStatusChart: React.FC<BarChartProps> = memo(({ category, globalTime, eventStates }) => {
  const styles = useStyles()
  const { t } = useTranslation(['mtd/common'])
  const featureNavigation = useFeatureNavigation()
  const { startDate, endDate } = useMemo(() => getDateRangeISOString(globalTime), [globalTime])

  const eventTypes = useMemo(() => {
    const enableUnresponsiveAgent: boolean = FeaturizationApi.isFeatureEnabled(
      FeatureName.MobileThreatDetectionUnresponsiveAgentThreat,
    )
    const enableDeveloperMode: boolean = FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionDeveloperModeThreat)
    return MobileProtectData.CATEGORY_TYPES(category)
      .filter(eventType => enableUnresponsiveAgent || eventType !== MobileProtectData.MobileThreatEventType.UNRESPONSIVE_AGENT)
      .filter(eventType => enableDeveloperMode || eventType !== MobileProtectData.MobileThreatEventType.DEVELOPER_MODE)
  }, [category])

  const request: MobileProtectData.MobileThreatEventQueryData = useMemo(() => {
    return {
      queries: eventTypes.map(eventType => ({
        queryId: eventType,
        startDateTime: startDate,
        endDateTime: endDate,
        eventTypes: [eventType],
        eventStates: eventStates,
      })),
      limit: 1,
    }
  }, [endDate, eventStates, eventTypes, startDate])

  const { data: countData, error } = useStatefulAsyncQuery(querytMobileEventCounts, {
    variables: request,
  })

  useBackendState(error)

  return (
    <div className={styles.chartListContainer}>
      <ChartHeader className={styles.chartHeader}>
        <TotalCount
          count={countData ? getTotal(countData?.data).toString() : '0'}
          description={t('common.total')}
          onInteraction={() => {
            mobileAlertNavigate(featureNavigation, {
              detectedStart: startDate,
              detectedEnd: endDate,
              type: eventTypes,
              status: eventStates,
              groupBy: MobileAlertGroupBy.NONE,
            })
          }}
        />
      </ChartHeader>
      <BarChart
        data={countData ? getData(t, countData?.data) : []}
        onInteraction={data => {
          mobileAlertNavigate(featureNavigation, {
            detectedStart: startDate,
            detectedEnd: endDate,
            status: eventStates,
            type: [data.metadata.key],
            groupBy: MobileAlertGroupBy.NONE,
          })
        }}
      />
    </div>
  )
})

export const MobileThreatsBarChart: React.FC<BarChartProps> = ({ id, category, globalTime }) => {
  const { t } = useTranslation(['mtd/common'])
  return (
    <WidgetTabs
      id={id}
      items={[
        {
          label: t('threatStatus.all'),
          component: useMemo(
            () => (
              <MobileThreatsBarStatusChart
                id={id}
                category={category}
                globalTime={globalTime}
                eventStates={[MobileProtectData.MobileThreatEventState.NEW, MobileProtectData.MobileThreatEventState.RESOLVED]}
              />
            ),
            [category, globalTime, id],
          ),
        },
        {
          label: t('threatStatus.new'),
          component: useMemo(
            () => (
              <MobileThreatsBarStatusChart
                id={id}
                category={category}
                globalTime={globalTime}
                eventStates={[MobileProtectData.MobileThreatEventState.NEW]}
              />
            ),
            [category, globalTime, id],
          ),
        },
        {
          label: t('threatStatus.resolved'),
          component: useMemo(
            () => (
              <MobileThreatsBarStatusChart
                id={id}
                category={category}
                globalTime={globalTime}
                eventStates={[MobileProtectData.MobileThreatEventState.RESOLVED]}
              />
            ),
            [category, globalTime, id],
          ),
        },
      ]}
    />
  )
}
