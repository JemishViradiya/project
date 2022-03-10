//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { PieChart } from '@ues-behaviour/dashboard'
import { Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'

import { useDataLayer } from '../hooks'

const { useBytesFormatterResolver, Abbreviation } = Hooks

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { queryTransferredBytes } = Data
const { makePageRoute } = Utils
const { Page } = Types

export const TransferredBytesWidget: React.FC<ChartProps> = memo(({ globalTime, height }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const bytesFormatterResolver = useBytesFormatterResolver()

  const { data, startDate, endDate } = useDataLayer({
    query: queryTransferredBytes,
    globalTime,
    hasNoData: data => isEmpty(data?.tenant?.traffic),
  })

  const uploaded = { label: t('dashboard.uploaded'), count: data?.tenant?.traffic?.bytes_toserver ?? 0 }
  const downloaded = { label: t('dashboard.downloaded'), count: data?.tenant?.traffic?.bytes_toclient ?? 0 }

  const handleInteraction = useCallback(
    () => window.location.assign(makePageRoute(Page.GatewayExternalEvents, { queryStringParams: { startDate, endDate } })),
    [startDate, endDate],
  )

  return (
    <PieChart
      height={height}
      data={[uploaded, downloaded]}
      formatter={value => bytesFormatterResolver(value, 2, Abbreviation.GB)}
      onInteraction={handleInteraction}
    />
  )
})
