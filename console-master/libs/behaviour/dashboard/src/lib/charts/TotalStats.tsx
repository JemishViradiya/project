/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import * as echarts from 'echarts'
import type { EChartsReactProps } from 'echarts-for-react'
import ReactEcharts from 'echarts-for-react'
import React, { memo, useMemo } from 'react'

import { makeStyles, useTheme } from '@material-ui/core'

import { useChartTheme } from './useChartTheme'

const defaultChartOptions = {
  showLegend: true,
  showTooltip: true,
}

/* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
function getChartOption(props, optionName) {
  const optionValue = props[optionName]
  if (typeof optionValue === 'undefined') return defaultChartOptions[optionName]
  return optionValue
}

function getSeries(props, theme) {
  return [
    {
      name: props.data.series,
      type: 'line',
      smooth: false,
      showSymbol: false,
      itemStyle: {
        color: theme.props.colors.charts.default.chart1,
      },
      lineStyle: {
        width: 1,
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: theme.props.colors.charts.default.chart1,
            },
            {
              offset: 1,
              color: theme.palette.background.default,
            },
          ],
          global: false,
        },
        opacity: 0.3,
      },
      data: props.data.data,
    },
  ]
}

const useStyles = makeStyles(theme => ({
  title: {
    ...theme.typography.h1,
    fontSize: '2rem',
  },
  subtitle: {
    ...theme.typography.caption,
    textAlign: 'center',
  },
  titleContainer: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70%',
  },
  chartContainer: {
    width: '100%',
    height: '30%',
  },
  container: {
    height: '100%',
    width: '100%',
  },
}))

function getGrid() {
  return {
    left: '0',
    right: '0',
    top: '0',
    bottom: '0',
  }
}

function getXAxis() {
  return {
    type: 'time',
    show: false,
  }
}

function getYAxis() {
  return {
    show: false,
    type: 'value',
  }
}

function getOption(props, theme) {
  if (!props.data) return {}
  return {
    title: {
      show: false,
    },
    animation: false,
    grid: getGrid(),
    xAxis: getXAxis(),
    yAxis: getYAxis(),
    series: getSeries(props, theme),
  }
}

export interface TotalStatsProps {
  id: string
  data: {
    series: string
    data: { value: [] }[]
  }
  title: string
  subtitle: string
  additionalProps?: EChartsReactProps['option']
}

export const TotalStats: React.FC<TotalStatsProps> = memo(props => {
  const theme = useTheme()
  const classes = useStyles()
  const { themeName, echartsTheme } = useChartTheme()

  echarts.registerTheme(themeName, echartsTheme)

  return useMemo(() => {
    return (
      <div id={props.id} className={classes.container}>
        <div className={classes.titleContainer}>
          <div className={classes.title}>{props.title}</div>
          <div className={classes.subtitle}>{props.subtitle}</div>
        </div>
        <div className={classes.chartContainer}>
          <ReactEcharts theme={themeName} option={getOption(props, theme)} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    )
  }, [props, theme, themeName, classes])
})
