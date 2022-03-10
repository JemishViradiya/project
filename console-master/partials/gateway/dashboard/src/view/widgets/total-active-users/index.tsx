//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { TotalCount } from '@ues-behaviour/dashboard'
import { Config, Data, Types, Utils } from '@ues-gateway/shared'

import { useDataLayer } from '../hooks'
import useStyles from './styles'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { queryTotalActiveUsers } = Data
const { makePageRoute } = Utils
const { EventsGroupByParam, Page } = Types

export const TotalActiveUsersWidget: React.FC<ChartProps> = memo(({ globalTime }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const classes = useStyles()

  const { data, startDate, endDate } = useDataLayer({
    query: queryTotalActiveUsers,
    globalTime,
    hasNoData: data => !data?.tenant?.counters,
  })

  const handleInteraction = useCallback(
    () =>
      window.location.assign(
        makePageRoute(Page.GatewayExternalEvents, {
          params: { groupBy: EventsGroupByParam.Users },
          queryStringParams: { startDate, endDate },
        }),
      ),
    [startDate, endDate],
  )

  return (
    <Box height="100%" display="flex" pt={2} justifyContent="center" className={classes.wrapper}>
      <TotalCount
        count={String(data?.tenant?.counters?.users ?? 0)}
        description={t('dashboard.totalActiveUsersWidgetDescription')}
        onInteraction={handleInteraction}
      />
    </Box>
  )
})
