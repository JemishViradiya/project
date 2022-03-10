//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { LineChart } from '@ues-behaviour/dashboard'
import { Config, Types, Utils } from '@ues-gateway/shared'

import type { NetworkAccessWidgetChartProps } from './types'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { EventsGroupByParam, Page } = Types
const { makePageRoute } = Utils

export const UsersChart: React.FC<NetworkAccessWidgetChartProps<[string | number, string | number][]>> = ({
  data,
  startDate,
  endDate,
  chartHeight,
}) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const handleInteraction = () => {
    window.location.assign(
      makePageRoute(Page.GatewayExternalEvents, {
        params: { groupBy: EventsGroupByParam.Users },
        queryStringParams: { startDate, endDate },
      }),
    )
  }
  return (
    <LineChart
      data={[{ series: t('common.users'), data }]}
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
