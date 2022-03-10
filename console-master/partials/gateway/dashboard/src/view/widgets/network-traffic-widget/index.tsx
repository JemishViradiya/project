//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { PieChart } from '@ues-behaviour/dashboard'
import { ReportingServiceAlertAction, ReportingServiceFilter } from '@ues-data/gateway'
import { Config, Data, Types, Utils } from '@ues-gateway/shared'

import { useDataLayer } from '../hooks'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { queryNetworkTraffic } = Data
const { makePageRoute } = Utils
const { Page } = Types

export const NetworkTrafficWidget: React.FC<ChartProps> = memo(({ globalTime, height }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const { data, startDate, endDate } = useDataLayer({
    query: queryNetworkTraffic,
    globalTime,
    hasNoData: data => !data?.tenant?.counters?.allowed && !data?.tenant?.counters?.blocked,
  })

  const allowed = {
    label: t('common.allowed'),
    count: data?.tenant?.counters?.allowed ?? 0,
    metadata: { type: ReportingServiceAlertAction.Allowed },
  }

  const blocked = {
    label: t('common.blocked'),
    count: data?.tenant?.counters?.blocked ?? 0,
    metadata: { type: ReportingServiceAlertAction.Blocked },
  }

  const handleInteraction = useCallback(
    data =>
      window.location.assign(
        makePageRoute(Page.GatewayExternalEvents, {
          queryStringParams: { startDate, endDate, [ReportingServiceFilter.AlertAction]: data.metadata.type },
        }),
      ),
    [startDate, endDate],
  )

  return <PieChart height={height} data={[allowed, blocked]} onInteraction={handleInteraction} />
})
