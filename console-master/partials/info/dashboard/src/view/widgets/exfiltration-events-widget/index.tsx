//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { DashboardTime, TimeIntervalId } from '@ues-behaviour/dashboard'
import { ChartHeader, getDateRangeTimestampString, GroupBySelect, LineChart, useGroupBy } from '@ues-behaviour/dashboard'
import { DashboardData, ExfiltrtationTypeEventsResponse } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'

import { exfiltrationEventsNavigate } from '../hooks/exfiltrationEventsNavigate'
import useStyles from '../styles'

export interface ExfiltrationLineChartProps {
  id: string
  globalTime?: DashboardTime
  height: number
  onInteraction?: () => void
}

const DEFAULT_GROUP_BY_TIME = '1'

const ExfiltrationEventsWidget: React.FC<ExfiltrationLineChartProps> = ({ id, globalTime, height }) => {
  const { t } = useTranslation('dlp/common')
  const { endDate, startDate } = useMemo(() => getDateRangeTimestampString(globalTime), [globalTime])
  const classes = useStyles()
  const { groupBy, setGroupBy } = useGroupBy({ id, defaultGroupBy: DEFAULT_GROUP_BY_TIME })

  const requestQueryParams = useMemo(() => {
    return {
      interval: groupBy,
      startTime: Number(startDate),
      stopTime: Number(endDate),
    }
  }, [groupBy, startDate, endDate])

  const { data, error, loading } = useStatefulReduxQuery(DashboardData.queryExfiltrationEvents, {
    variables: {
      queryParams: requestQueryParams,
    },
  })

  const chartData = useMemo(() => {
    const chartData = []
    if (!isEmpty(data)) {
      for (const key in data?.view) {
        chartData.push({
          series: t(`dashboard.exfiltrationEventTypes.${key}`),
          urlEventTypeKeys: key,
          data: data.view[key].map(item => [item.key, item.count]),
        })
      }
      return chartData
    }
  }, [data, t])

  const onDataPointIteraction = data => {
    const detectedStart = data.dataPointValue[0]
    const detectedEnd = new Date(new Date(detectedStart).getTime() + parseInt(groupBy) * 3600000).getTime()
    exfiltrationEventsNavigate({
      startTime: detectedStart,
      stopTime: detectedEnd,
      eventType: [data.urlEventTypeKeys.replace(' ', '_').toUpperCase()],
    })
  }

  return (
    <div className={classes.chartContainer}>
      <ChartHeader className={classes.chartHeader}>
        <div>
          <GroupBySelect groupBy={groupBy} setGroupBy={setGroupBy}></GroupBySelect>
        </div>
      </ChartHeader>
      <LineChart
        data={chartData}
        onInteraction={onDataPointIteraction}
        height={height}
        additionalProps={{
          showLegend: true,
          showTooltip: true,
          showZoom: true,
        }}
      />
    </div>
  )
}

export default ExfiltrationEventsWidget
