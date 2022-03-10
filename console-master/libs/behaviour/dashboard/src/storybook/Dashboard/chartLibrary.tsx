/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useMemo } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/SvgIcon'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { chartIcon, ChartType } from '@ues-behaviour/dashboard'

const useStyles = makeStyles(theme => ({
  countChartContainer: {
    height: '100%',
    paddingTop: theme.spacing(1),
  },
  chartContainer: {
    height: '100%',
  },
  chartPlaceHolder: {
    width: '100%',
    height: `calc(100% - ${theme.spacing(4)}px)`,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.grey[300],
  },
}))

const ChartWidget = (props: ChartProps) => {
  const styles = useStyles()

  const { width, height, chartType } = props

  const placeHolderIconSize = chartType === ChartType.Count ? Math.min(width, height + 24) : Math.min(width, height - 54)

  return useMemo(() => {
    return (
      <div className={chartType === ChartType.Count ? styles.countChartContainer : styles.chartContainer}>
        <div className={styles.chartPlaceHolder}>
          <Icon style={{ fontSize: placeHolderIconSize }} component={chartIcon(chartType)} />
        </div>
      </div>
    )
  }, [chartType, placeHolderIconSize, styles])
}

const myComponent = (props: ChartProps): JSX.Element => {
  return <ChartWidget {...props} />
}

export const chartLibrary = {
  chart1: {
    title: 'Card title 1',
    defaultWidth: 3,
    defaultHeight: 5,
    chartType: ChartType.Count,
    showCardTitle: false,
    component: myComponent,
  },
  chart2: {
    title: 'Card title 2',
    defaultWidth: 3,
    defaultHeight: 5,
    chartType: ChartType.Count,
    showCardTitle: false,
    component: myComponent,
  },
  chart3: {
    title: 'Card title 3',
    defaultWidth: 6,
    defaultHeight: 5,
    chartType: ChartType.Count,
    showCardTitle: false,
    component: myComponent,
  },
  chart4: {
    title: 'Card title 4',
    defaultWidth: 3,
    defaultHeight: 7,
    component: myComponent,
    chartType: ChartType.Donut,
  },
  chart5: {
    title: 'Card title 5',
    defaultWidth: 9,
    defaultHeight: 7,
    component: myComponent,
    chartType: ChartType.Line,
  },
}
