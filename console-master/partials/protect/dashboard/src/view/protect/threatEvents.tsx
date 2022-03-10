/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import Chip from '@material-ui/core/Chip'
import { useTheme } from '@material-ui/core/styles'

import type { ChartProps, LineChartProps } from '@ues-behaviour/dashboard'
import { LineChart, TimeIntervalId, TimeSelectSmall, useCustomTimeSelect } from '@ues-behaviour/dashboard'
import { EppDashboardData } from '@ues-data/epp'
import type { UesTheme } from '@ues/assets'

import { ChartWidget } from './chartWidget'
import { useStyles } from './styles'

const threatEventsFormatter = {
  xAxis: value => {
    const date = new Date(value)
    const texts = [date.getMonth() + 1, date.getDate()]
    return texts.join('/')
  },
}

const ThreatEvents = React.memo(
  (props: ChartProps): JSX.Element => {
    const styles = useStyles()
    const theme = useTheme<UesTheme>()

    const { id, height } = props
    const chartHeight = height - theme.spacing(9)

    // const { customTimeInterval } = useCustomTimeSelect({
    //   id,
    //   defaultTimeInterval: TimeIntervalId.Last30Days,
    // })

    const threatEventsPalette = useMemo(
      () => ({
        ...theme.palette.chipAlert,
        removed: theme.palette.grey[400],
        waived: theme.palette.blue[500],
        quarantined: theme.palette.green[600],
      }),
      [theme.palette.blue, theme.palette.chipAlert, theme.palette.green, theme.palette.grey],
    )

    const {
      tasks: { threatEvents },
    }: EppDashboardData.EppDashboardState = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice])

    const threatProtection = (useMemo(
      () =>
        threatEvents.loading
          ? []
          : [
              {
                series: 'Unsafe',
                data: threatEvents.result?.map(ev => [ev.ThreatEventsDate, ev.UnsafeCount]),
                colorKey: 'high',
              },
              {
                series: 'Abnormal',
                data: threatEvents.result?.map(ev => [ev.ThreatEventsDate, ev.AbnormalCount]),
                colorKey: 'medium',
              },
              {
                series: 'Quarantined',
                data: threatEvents.result?.map(ev => [ev.ThreatEventsDate, ev.QuarantinedCount]),
                colorKey: 'quarantined',
              },
              {
                series: 'Waived',
                data: threatEvents.result?.map(ev => [ev.ThreatEventsDate, ev.WaivedCount]),
                colorKey: 'waived',
              },
              {
                series: 'Removed',
                data: threatEvents.result?.map(ev => [ev.ThreatEventsDate, ev.RemovedCount]),
                colorKey: 'removed',
              },
            ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [threatEvents],
    ) as unknown) as LineChartProps['data']

    return (
      <ChartWidget {...props}>
        <div className={styles.selectContainer}>
          <Chip size="small" variant="default" label={'Last 30 days'} clickable={false} />
        </div>
        {threatEvents.loading || (
          <LineChart
            height={chartHeight}
            data={threatProtection}
            customPalette={threatEventsPalette}
            formatters={threatEventsFormatter}
          />
        )}
      </ChartWidget>
    )
  },
)

export { ThreatEvents }
