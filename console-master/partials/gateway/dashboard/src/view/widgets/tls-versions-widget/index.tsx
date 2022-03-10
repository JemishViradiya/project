//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { memo, useCallback } from 'react'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { PieChart } from '@ues-behaviour/dashboard'
import { DASHBOARD_WIDGET_MAX_RECORDS_COUNT, ReportingServiceFilter } from '@ues-data/gateway'
import { Data, Types, Utils } from '@ues-gateway/shared'

import { useDataLayer } from '../hooks'

const { queryTLSVersions } = Data
const { makePageRoute } = Utils
const { Page } = Types

export const TLSVersionsWidget: React.FC<ChartProps> = memo(({ globalTime, height }) => {
  const { startDate, endDate, data } = useDataLayer({
    query: queryTLSVersions,
    globalTime,
    hasNoData: data => !data?.tenant?.tunnelAgg?.buckets?.length,
    defaultQueryVariables: { maxRecords: DASHBOARD_WIDGET_MAX_RECORDS_COUNT },
  })

  const chartData = (data?.tenant?.tunnelAgg?.buckets ?? []).map(({ key, count }) => ({ label: key, count }))

  const handleInteraction = useCallback(
    data =>
      window.location.assign(
        makePageRoute(Page.GatewayExternalEvents, {
          queryStringParams: { startDate, endDate, [ReportingServiceFilter.TlsVersion]: data.label },
        }),
      ),
    [startDate, endDate],
  )

  return <PieChart height={height} data={chartData} onInteraction={handleInteraction} />
})
