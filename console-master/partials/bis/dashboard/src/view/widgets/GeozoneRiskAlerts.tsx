//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { getDateRangeTimestampString, LineChart } from '@ues-behaviour/dashboard'
import { GeozoneRiskLineQuery } from '@ues-data/bis'
import { RiskLevelTypes } from '@ues-data/bis/model'
import { useStatefulApolloSubscription } from '@ues-data/shared'
import type { UesTheme } from '@ues/assets'

import { convertRangeBoundaryToSeconds, isSupportedRiskLevel } from './utils'

const BUCKETS_RISK_LEVEL_TYPES_MAP = {
  high: RiskLevelTypes.HIGH,
  medium: RiskLevelTypes.MEDIUM,
  low: RiskLevelTypes.LOW,
}

const GeozoneRiskAlerts: React.FC<ChartProps> = memo(({ globalTime, height }) => {
  const { t } = useTranslation('bis/shared')
  const theme = useTheme<UesTheme>()
  const customPalette = useMemo(() => ({ ...theme.palette.chipAlert }), [theme.palette.chipAlert])

  const { startDate, endDate } = useMemo(() => getDateRangeTimestampString(globalTime), [globalTime])

  const variables = useMemo(
    () => ({
      range: {
        start: convertRangeBoundaryToSeconds(startDate),
        end: convertRangeBoundaryToSeconds(endDate),
      },
    }),
    [endDate, startDate],
  )
  const { data } = useStatefulApolloSubscription(GeozoneRiskLineQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })

  const [hasValidData, chartData] = useMemo(() => {
    if (!data || !data.geozoneRiskLine) {
      return [false, []]
    }

    const firstSeries = data?.geozoneRiskLine[0]?.data ?? []
    if (firstSeries.length === 0) {
      return [false, []]
    }

    const chartData = data.geozoneRiskLine
      .filter(br => isSupportedRiskLevel(br.bucket))
      .map(series => {
        const riskLevel = BUCKETS_RISK_LEVEL_TYPES_MAP[series.bucket]
        return {
          series: t(`risk.level.${riskLevel}`),
          colorKey: series.bucket,
          data: series.data.map(point => [point.time * 1000, point.count]),
          riskLevel,
        }
      })

    return [true, chartData]
  }, [t, data])

  if (hasValidData) {
    return (
      <LineChart
        data={chartData}
        height={height}
        customPalette={customPalette}
        additionalProps={{ showLegend: true, showTooltip: true, showZoom: true }}
      />
    )
  } else {
    return null
  }
})

export default GeozoneRiskAlerts
