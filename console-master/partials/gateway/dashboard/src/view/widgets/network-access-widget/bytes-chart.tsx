//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { LineChart } from '@ues-behaviour/dashboard'
import { Config, Types, Utils } from '@ues-gateway/shared'

import type { BytesReportingCountData, NetworkAccessWidgetChartProps } from './types'

const { computeDataPointStartTimestamp, makePageRoute } = Utils
const { Page } = Types
const { GATEWAY_TRANSLATIONS_KEY } = Config

export const BytesChart: React.FC<NetworkAccessWidgetChartProps<BytesReportingCountData>> = ({ chartHeight, data, globalTime }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY, 'formats'])

  const handleInteraction = interaction => {
    const endDataPointTimestamp = interaction.dataPointValue[0]

    window.location.assign(
      makePageRoute(Page.GatewayExternalEvents, {
        queryStringParams: {
          startDate: computeDataPointStartTimestamp(endDataPointTimestamp, globalTime.timeInterval),
          endDate: String(endDataPointTimestamp),
        },
      }),
    )
  }

  return (
    <LineChart
      data={[
        { series: t('dashboard.uploaded'), data: data?.uploaded },
        { series: t('dashboard.downloaded'), data: data?.downloaded },
      ]}
      onInteraction={handleInteraction}
      height={chartHeight}
      additionalProps={{
        showLegend: true,
        showTooltip: true,
        showZoom: true,
      }}
      formatters={{
        yAxis: value => t('formats:fileSizes.gigaBytes.abbreviation', { size: value }),
      }}
    />
  )
}
