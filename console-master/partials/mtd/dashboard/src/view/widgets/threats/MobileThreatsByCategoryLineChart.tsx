import type { TFunction } from 'i18next'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { DashboardTime, EnhancedChartEntry, LineChartData } from '@ues-behaviour/dashboard'
import {
  ChartHeader,
  DEFAULT_TIME_INTERVAL,
  getDateRangeISOString,
  GroupBySelect,
  LineChart,
  TimeSelectSmall,
  TOTAL_COUNT_HEIGHT,
  TotalCount,
  useCustomTimeSelect,
  useGroupBy,
  WIDGET_TABS_HEIGHT,
  WidgetTabs,
} from '@ues-behaviour/dashboard'
import { MobileProtectData, queryMobileEventSeries } from '@ues-data/mtd'
import { FeatureName, FeaturizationApi, useStatefulAsyncQuery } from '@ues-data/shared'
import { MobileAlertGroupBy } from '@ues-mtd/shared'

import { useBackendState } from './hooks/useBackendState'
import { mobileAlertNavigate, useFeatureNavigation } from './hooks/useDashboardNavigate'
import { useStyles } from './styles'

export interface ByCategoryLineChartProps {
  id: string
  globalTime: DashboardTime
  height: number
  onInteraction?: () => void
  eventStates?: MobileProtectData.MobileThreatEventState[]
}

const DEFAULT_GROUP_BY_TIME = '1'
const LIMIT = 1000

function getData(seriesData: MobileProtectData.MobileThreatEventSeries[], t: TFunction): EnhancedChartEntry<LineChartData[]> {
  const chartData = []
  if (seriesData !== undefined) {
    for (const queryEntry of seriesData) {
      const lineData = []
      for (const entry of queryEntry.series) {
        lineData.push({ value: [entry.startDateTime, entry.count] })
      }
      chartData.push({ data: lineData, series: t(`threats.${queryEntry.queryId}`), metadata: { key: queryEntry.queryId } })
    }
  }
  return chartData
}

const MobileThreatsByCategoryLineStatusChart: React.FC<ByCategoryLineChartProps> = memo(
  ({ id, globalTime, height, eventStates }) => {
    const styles = useStyles()
    const featureNavigation = useFeatureNavigation()
    const { t } = useTranslation(['mtd/common'])
    const { groupBy, setGroupBy } = useGroupBy({ id, defaultGroupBy: DEFAULT_GROUP_BY_TIME })

    const { showCustomTime, customDashboardTime, setCustomDashboardTime } = useCustomTimeSelect({
      id,
      defaultTimeInterval: DEFAULT_TIME_INTERVAL,
    })

    const timeInterval = showCustomTime ? customDashboardTime : globalTime
    const { startDate, endDate } = useMemo(() => getDateRangeISOString(timeInterval), [timeInterval])

    const chartHeight = height - TOTAL_COUNT_HEIGHT

    const getCategoryEventTypes = (category: MobileProtectData.MobileThreatEventCategory) => {
      const enableUnresponsiveAgent: boolean = FeaturizationApi.isFeatureEnabled(
        FeatureName.MobileThreatDetectionUnresponsiveAgentThreat,
      )
      const enableDeveloperMode: boolean = FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionDeveloperModeThreat)

      return MobileProtectData.CATEGORY_TYPES(category)
        .filter(eventType => enableUnresponsiveAgent || eventType !== MobileProtectData.MobileThreatEventType.UNRESPONSIVE_AGENT)
        .filter(eventType => enableDeveloperMode || eventType !== MobileProtectData.MobileThreatEventType.DEVELOPER_MODE)
    }

    const request: MobileProtectData.MobileThreatEventQueryData = useMemo(() => {
      const enableUnsafeMessage: boolean = FeaturizationApi.isFeatureEnabled(FeatureName.MobileThreatDetectionUnsafeMsgThreat)

      const categoryItems = Object.values(MobileProtectData.MobileThreatEventCategory).filter(
        categoryItem => enableUnsafeMessage || categoryItem !== MobileProtectData.MobileThreatEventCategory.SAFE_BROWSING,
      )

      return {
        queries: categoryItems.map(category => {
          const eventTypes = getCategoryEventTypes(category)
          return {
            queryId: category,
            startDateTime: startDate,
            endDateTime: endDate,
            eventTypes: eventTypes,
            groupByTime: MobileProtectData.HOURS_GROUPBY(parseInt(groupBy)),
            eventStates: eventStates,
          }
        }),
        limit: LIMIT,
      }
    }, [endDate, eventStates, groupBy, startDate])

    const { data: seriesData, error } = useStatefulAsyncQuery(queryMobileEventSeries, {
      variables: request,
    })

    useBackendState(error)

    const chartData = getData(seriesData, t)

    function getSeriesTotal(series: MobileProtectData.MobileThreatEventSeriesEntry[]): number {
      let total = 0
      if (series !== undefined) {
        series.forEach(element => (total += element.count))
      }
      return total
    }

    function getTotal(seriesData: MobileProtectData.MobileThreatEventSeries[]): number {
      let total = 0
      if (seriesData !== undefined) {
        seriesData.forEach(element => (total += getSeriesTotal(element.series)))
      }
      return total
    }

    function onDataPointIteraction(data) {
      const detectedStart = data.dataPointValue[0]
      const detectedEnd = new Date(new Date(detectedStart).getTime() + parseInt(groupBy) * 3600000).toISOString()
      mobileAlertNavigate(featureNavigation, {
        detectedStart: detectedStart,
        detectedEnd: detectedEnd,
        groupBy: MobileAlertGroupBy.NONE,
        status: eventStates,
        type: getCategoryEventTypes(data.metadata.key),
      })
    }

    return (
      <div className={styles.chartContainer}>
        <ChartHeader className={styles.chartHeader}>
          <div>
            <TotalCount
              count={getTotal(seriesData).toString()}
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
          </div>
          <div className={styles.selectContainer}>
            <GroupBySelect groupBy={groupBy} setGroupBy={setGroupBy}></GroupBySelect>
            {showCustomTime && <TimeSelectSmall dashboardTime={customDashboardTime} setDashboardTime={setCustomDashboardTime} />}
          </div>
        </ChartHeader>
        <LineChart
          data={chartData}
          height={chartHeight}
          additionalProps={{
            showZoom: true,
          }}
          onInteraction={onDataPointIteraction}
        />
      </div>
    )
  },
)

export const MobileThreatsByCategoryLineChart: React.FC<ByCategoryLineChartProps> = ({ id, globalTime, height }) => {
  const { t } = useTranslation(['mtd/common'])
  return (
    <WidgetTabs
      id={id}
      items={[
        {
          label: t('threatStatus.all'),
          component: useMemo(
            () => (
              <MobileThreatsByCategoryLineStatusChart
                id={id}
                globalTime={globalTime}
                height={height - WIDGET_TABS_HEIGHT}
                eventStates={[MobileProtectData.MobileThreatEventState.NEW, MobileProtectData.MobileThreatEventState.RESOLVED]}
              />
            ),
            [globalTime, height, id],
          ),
        },
        {
          label: t('threatStatus.new'),
          component: useMemo(
            () => (
              <MobileThreatsByCategoryLineStatusChart
                id={id}
                globalTime={globalTime}
                height={height - WIDGET_TABS_HEIGHT}
                eventStates={[MobileProtectData.MobileThreatEventState.NEW]}
              />
            ),
            [globalTime, height, id],
          ),
        },
        {
          label: t('threatStatus.resolved'),
          component: useMemo(
            () => (
              <MobileThreatsByCategoryLineStatusChart
                id={id}
                globalTime={globalTime}
                height={height - WIDGET_TABS_HEIGHT}
                eventStates={[MobileProtectData.MobileThreatEventState.RESOLVED]}
              />
            ),
            [globalTime, height, id],
          ),
        },
      ]}
    />
  )
}
