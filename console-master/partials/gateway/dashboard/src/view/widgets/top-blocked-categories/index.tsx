//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React, { memo } from 'react'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { ChartErrorHandler, PieChart } from '@ues-behaviour/dashboard'
import { DASHBOARD_WIDGET_MAX_RECORDS_COUNT } from '@ues-data/gateway'
import { Data, Hooks } from '@ues-gateway/shared'

import { useDataLayer } from '../hooks'

const { queryTopBlockedCategories } = Data
const { useCategoriesData } = Hooks

export const TopBlockedCategories: React.FC<ChartProps> = memo(({ globalTime, height }) => {
  const { categoryIdsMap } = useCategoriesData()
  const { data } = useDataLayer({
    query: queryTopBlockedCategories,
    globalTime,
    defaultQueryVariables: { maxRecords: DASHBOARD_WIDGET_MAX_RECORDS_COUNT },
  })
  const chartData = (data?.tenant?.tunnelAgg?.buckets ?? []).map(({ key, blocked }) => ({
    label: categoryIdsMap[key] || key,
    count: blocked,
  }))

  return !chartData?.length ? (
    <ChartErrorHandler noData fallbackStyles={{ alignItems: 'center', marginTop: '15%' }} />
  ) : (
    <PieChart height={height} data={chartData} additionalProps={{ verticalAlign: false }} />
  )
})
