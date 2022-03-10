import type { TFunction } from 'i18next'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartProps, DashboardTime, EnhancedChartEntry, PieChartData } from '@ues-behaviour/dashboard'
import {
  ChartHeader,
  getDateRangeISOString,
  PieChart,
  TOTAL_COUNT_HEIGHT,
  TotalCount,
  WIDGET_TABS_HEIGHT,
  WidgetTabs,
} from '@ues-behaviour/dashboard'
import { MobileProtectData, querytMobileEventCounts } from '@ues-data/mtd'
import { FeatureName, FeaturizationApi, useStatefulAsyncQuery } from '@ues-data/shared'
import { MobileAlertGroupBy } from '@ues-mtd/shared'

import { useBackendState } from './hooks/useBackendState'
import { mobileAlertNavigate, useFeatureNavigation } from './hooks/useDashboardNavigate'
import { useStyles } from './styles'

export interface PieChartProps {
  globalTime: DashboardTime
  height: number
  eventStates?: MobileProtectData.MobileThreatEventState[]
}

const MobileThreatsPieStatusChart: React.FC<PieChartProps> = memo(({ height, globalTime, eventStates }) => {
  const styles = useStyles()
  const featureNavigation = useFeatureNavigation()
  const { t } = useTranslation(['mtd/common'])
  const { startDate, endDate } = useMemo(() => getDateRangeISOString(globalTime), [globalTime])

  const getCategoryEventTypes = (category: MobileProtectData.MobileThreatEventCategory) => {
    const enableUnresponsiveAgent: boolean = FeaturizationApi.isFeatureEnabled(
      FeatureName.MobileThreatDetectionUnresponsiveAgentThreat,
    )
    const enableDeveloperMode: boolean = FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionDeveloperModeThreat)
    return MobileProtectData.CATEGORY_TYPES(category)
      .filter(eventType => enableUnresponsiveAgent || eventType !== MobileProtectData.MobileThreatEventType.UNRESPONSIVE_AGENT)
      .filter(eventType => enableDeveloperMode || eventType !== MobileProtectData.MobileThreatEventType.DEVELOPER_MODE)
  }

  const categoryItems = useMemo(() => {
    const enableUnsafeMessage: boolean = FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionUnsafeMsgThreat)
    return Object.values(MobileProtectData.MobileThreatEventCategory).filter(
      categoryItem => enableUnsafeMessage || categoryItem !== MobileProtectData.MobileThreatEventCategory.SAFE_BROWSING,
    )
  }, [])

  const request: MobileProtectData.MobileThreatEventQueryData = useMemo(() => {
    return {
      queries: categoryItems.map(category => ({
        queryId: category,
        startDateTime: startDate,
        endDateTime: endDate,
        eventTypes: getCategoryEventTypes(category),
        eventStates: eventStates,
      })),
      limit: 1,
    }
  }, [categoryItems, endDate, eventStates, startDate])

  const { data: countData, error } = useStatefulAsyncQuery(querytMobileEventCounts, {
    variables: request,
  })

  useBackendState(error)

  function getData(
    t: TFunction,
    mobileThreatEventCount: MobileProtectData.MobileThreatEventCount[],
    categoryItems: MobileProtectData.MobileThreatEventCategory[],
  ): EnhancedChartEntry<PieChartData>[] {
    const category_count = new Map(categoryItems.map(cat => [cat, 0]))
    mobileThreatEventCount.forEach(threat => {
      const category = threat.queryId as MobileProtectData.MobileThreatEventCategory
      category_count.set(category, category_count.get(category) + threat.count)
    })

    const chartData = []
    category_count.forEach((value, key) => chartData.push({ label: t('threats.' + key), count: value, metadata: { key: key } }))
    return chartData
  }

  function getTotal(mobileThreatEventCount: MobileProtectData.MobileThreatEventCount[]): number {
    let total = 0
    mobileThreatEventCount.forEach(element => (total += element.count))
    return total
  }

  const chartHeight = height - TOTAL_COUNT_HEIGHT
  return (
    <div className={styles.chartContainer}>
      <ChartHeader className={styles.chartHeader}>
        {
          <TotalCount
            count={countData ? getTotal(countData?.data).toString() : '0'}
            description={t('common.total')}
            onInteraction={() =>
              mobileAlertNavigate(featureNavigation, {
                detectedStart: startDate,
                detectedEnd: endDate,
                groupBy: MobileAlertGroupBy.NONE,
                status: eventStates,
              })
            }
          />
        }
      </ChartHeader>
      <PieChart
        onInteraction={data => {
          mobileAlertNavigate(featureNavigation, {
            detectedStart: startDate,
            detectedEnd: endDate,
            type: getCategoryEventTypes(data.metadata.key),
            status: eventStates,
            groupBy: MobileAlertGroupBy.NONE,
          })
        }}
        height={chartHeight}
        data={countData ? getData(t, countData?.data, categoryItems) : []}
      />
    </div>
  )
})

const MobileThreatsPieChart: React.FC<ChartProps> = ({ id, height, globalTime }) => {
  const { t } = useTranslation(['mtd/common'])
  return (
    <WidgetTabs
      id={id}
      items={[
        {
          label: t('threatStatus.all'),
          component: useMemo(
            () => (
              <MobileThreatsPieStatusChart
                globalTime={globalTime}
                height={height - WIDGET_TABS_HEIGHT}
                eventStates={[MobileProtectData.MobileThreatEventState.NEW, MobileProtectData.MobileThreatEventState.RESOLVED]}
              />
            ),
            [globalTime, height],
          ),
        },
        {
          label: t('threatStatus.new'),
          component: useMemo(
            () => (
              <MobileThreatsPieStatusChart
                globalTime={globalTime}
                height={height - WIDGET_TABS_HEIGHT}
                eventStates={[MobileProtectData.MobileThreatEventState.NEW]}
              />
            ),
            [globalTime, height],
          ),
        },
        {
          label: t('threatStatus.resolved'),
          component: useMemo(
            () => (
              <MobileThreatsPieStatusChart
                globalTime={globalTime}
                height={height - WIDGET_TABS_HEIGHT}
                eventStates={[MobileProtectData.MobileThreatEventState.RESOLVED]}
              />
            ),
            [globalTime, height],
          ),
        },
      ]}
    />
  )
}

export default MobileThreatsPieChart
