//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import moment from 'moment'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles, useTheme } from '@material-ui/core'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { StackedHorizontalBar } from '@ues-behaviour/dashboard'
import { LatestEventsQuery } from '@ues-data/bis'
import { RiskLevelTypes } from '@ues-data/bis/model'
import { useStatefulApolloSubscription } from '@ues-data/shared'
import type { UesTheme } from '@ues/assets'

const useStyles = makeStyles(theme => ({
  container: {
    paddingRight: theme.spacing(2),
  },
}))

const RealTimeAlerts: React.FC<ChartProps> = memo(() => {
  const { t } = useTranslation('bis/shared')
  const theme = useTheme<UesTheme>()
  const customPalette = useMemo(() => ({ ...theme.palette.chipAlert }), [theme.palette.chipAlert])
  const classNames = useStyles()

  const { data } = useStatefulApolloSubscription(LatestEventsQuery, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })

  const totalData = useMemo(
    () =>
      (data?.latestEvents ?? []).map(r => ({
        ...r,
        // convert the time to  the 1/2 hour to make the bars appear between hour ticks
        y: moment(r.datetime * 1000)
          .add(30, 'minutes')
          .valueOf(),
      })),
    [data?.latestEvents],
  )

  // plotting is a bit finicky.  We have to pull the buckets apart
  const chartData = useMemo(
    () => [
      {
        series: t('risk.level.MEDIUM'),
        colorKey: 'medium',
        data: totalData.map(d => [d.medium, d.y] as [number, number]),
        riskLevel: RiskLevelTypes.MEDIUM,
      },
      {
        series: t('risk.level.HIGH'),
        colorKey: 'high',
        data: totalData.map(d => [d.high, d.y] as [number, number]),
        riskLevel: RiskLevelTypes.HIGH,
      },
      {
        series: t('risk.level.CRITICAL'),
        colorKey: 'critical',
        data: totalData.map(d => [d.critical, d.y] as [number, number]),
        riskLevel: RiskLevelTypes.CRITICAL,
      },
    ],
    [t, totalData],
  )

  if (!data || !data.latestEvents) {
    return null
  }

  return (
    <div className={classNames.container}>
      <StackedHorizontalBar data={chartData} customPalette={customPalette} />
    </div>
  )
})

export default RealTimeAlerts
