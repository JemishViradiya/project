//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { LineChart } from '@ues-behaviour/dashboard'
import { ReportingServiceAlertAction, ReportingServiceFilter } from '@ues-data/gateway'
import { Config, Types, Utils } from '@ues-gateway/shared'

import type { EventsReportingCountData, NetworkAccessWidgetChartProps } from './types'

const { computeDataPointStartTimestamp, makePageRoute } = Utils
const { GATEWAY_TRANSLATIONS_KEY } = Config

export const EventsChart: React.FC<NetworkAccessWidgetChartProps<EventsReportingCountData>> = ({
  data,
  networkRouteType,
  globalTime,
  chartHeight,
}) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const handleInteraction = interaction => {
    const endDataPointTimestamp = interaction.dataPointValue[0]

    window.location.assign(
      makePageRoute(Types.Page.GatewayExternalEvents, {
        queryStringParams: {
          startDate: computeDataPointStartTimestamp(endDataPointTimestamp, globalTime.timeInterval),
          endDate: String(endDataPointTimestamp),
          [ReportingServiceFilter.AlertAction]: interaction.metadata.type,
          [ReportingServiceFilter.NetworkRoute]: networkRouteType,
        },
      }),
    )
  }

  return (
    <LineChart
      data={[
        {
          series: t('common.allowed'),
          data: data?.allowedTraffic,
          metadata: { type: ReportingServiceAlertAction.Allowed },
        },
        {
          series: t('common.blocked'),
          data: data?.blockedTraffic,
          metadata: { type: ReportingServiceAlertAction.Blocked },
        },
      ]}
      onInteraction={handleInteraction}
      height={chartHeight}
      additionalProps={{
        showLegend: true,
        showTooltip: true,
        showZoom: true,
      }}
    />
  )
}
