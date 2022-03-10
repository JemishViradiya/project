//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { ChartErrorHandler, PieChart, WidgetTabs } from '@ues-behaviour/dashboard'
import { DASHBOARD_WIDGET_MAX_RECORDS_COUNT } from '@ues-data/gateway'
import { Config, Data, Hooks } from '@ues-gateway/shared'

import { useDataLayer } from '../hooks'

const { querySecurityRiskCategories } = Data
const { useCategoriesData } = Hooks

const NoDataComponent = <ChartErrorHandler noData fallbackStyles={{ alignItems: 'center', marginTop: '15%' }} />

export const SecurityRiskCategoriesWidget: React.FC<ChartProps> = memo(({ id, globalTime, height }) => {
  const { t } = useTranslation([Config.GATEWAY_TRANSLATIONS_KEY])
  const { categoryIdsMap } = useCategoriesData()
  const { data } = useDataLayer({
    query: querySecurityRiskCategories,
    globalTime,
    defaultQueryVariables: { maxRecords: DASHBOARD_WIDGET_MAX_RECORDS_COUNT },
  })

  const chartData = (data?.tenant?.tunnelAgg?.buckets ?? []).reduce(
    (acc, { key, blocked, allowed, count }) => {
      return {
        ...acc,
        blocked: [
          ...acc.blocked,
          {
            label: categoryIdsMap[key],
            count: blocked,
          },
        ],
        allowed: [
          ...acc.allowed,
          {
            label: categoryIdsMap[key],
            count: allowed,
          },
        ],
        all: [
          ...acc.all,
          {
            label: categoryIdsMap[key],
            count: count,
          },
        ],
      }
    },
    { blocked: [], allowed: [], all: [] },
  )

  return (
    <WidgetTabs
      id={id}
      items={[
        {
          label: t('events.networkRouteAll'),
          component: !chartData.all.length ? (
            NoDataComponent
          ) : (
            <PieChart height={height} data={chartData.all} additionalProps={{ verticalAlign: false }} />
          ),
        },
        {
          label: t('common.allowed'),
          component: !chartData.all.length ? (
            NoDataComponent
          ) : (
            <PieChart height={height} data={chartData.allowed} additionalProps={{ verticalAlign: false }} />
          ),
        },
        {
          label: t('common.blocked'),
          component: !chartData.all.length ? (
            NoDataComponent
          ) : (
            <PieChart height={height} data={chartData.blocked} additionalProps={{ verticalAlign: false }} />
          ),
        },
      ]}
    />
  )
})
