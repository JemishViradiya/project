//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import * as echarts from 'echarts'
import type { EChartsReactProps } from 'echarts-for-react'
import ReactEcharts from 'echarts-for-react'
import React, { memo } from 'react'

import { useTheme } from '@material-ui/core'

import type { ToolTipItem } from './useChartTheme'
import { formattedToolTip, useChartTheme } from './useChartTheme'
import { remToPx } from './utils'

const LINE_COLOR = '#eaecee'
const TEXT_COLOR = '#555555'

const defaultChartOptions = {
  showLegend: true,
  showTooltip: true,
  showZoom: true,
}

const getChartOption = (props, optionName) => {
  const optionValue = props[optionName]
  return typeof optionValue === 'undefined' ? defaultChartOptions[optionName] : optionValue
}

const getSeries = props => {
  const series = []
  for (const ds of props.data) {
    series.push({
      name: ds.series,
      type: 'custom',
      renderItem: renderItem,
      itemStyle: {
        color: ds?.data?.[0]?.[2],
      },
      dimensions: ['name', 'status', 'color', 'startTimeStamp', 'endTimeStamp'],
      encode: {
        x: [3, 4],
        y: 0,
      },
      data: ds.data,
    })
  }
  return series
}

const getGrid = theme => {
  return {
    left: theme.spacing(1),
    right: theme.spacing(1),
    top: theme.spacing(4),
    bottom: theme.spacing(20),
    borderColor: LINE_COLOR,
    containLabel: true,
  }
}

const getXAxis = theme => {
  return {
    position: 'top',
    splitLine: false,
    type: 'time',
    axisLine: {
      show: true,
      lineStyle: {
        color: theme.palette.grey[200],
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: TEXT_COLOR,
      fontSize: remToPx(theme.typography.caption.fontSize),
      formatter: function (value) {
        return `${new Date(value).toLocaleDateString()}`
      },
    },
  }
}

const getYAxis = theme => {
  return {
    splitLine: false,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: TEXT_COLOR,
      fontSize: remToPx(theme.typography.caption.fontSize),
    },
    type: 'category',
  }
}

const getZoom = (props, theme) => {
  if (!getChartOption(props, 'showZoom')) {
    return { show: false }
  } else {
    return {
      show: true,
      filterMode: 'none',
      start: 70,
      end: 100,
      bottom: 36,
    }
  }
}

const getLegend = (props, theme) => ({
  show: getChartOption(props, 'showLegend'),
  data: props.data.map(x => x.series),
  icon: 'rect',
  left: 'left',
  bottom: '0px',
  width: '98%',
  type: 'scroll',
})

const renderItem = (params, api) => {
  const categoryIndex = api.value(0)
  const start = api.coord([api.value(3), categoryIndex])
  const end = api.coord([api.value(4), categoryIndex])
  const height = api.size([0, 1])[1] * 0.4

  const rectShape = echarts.graphic.clipRectByRect(
    {
      x: start[0],
      y: start[1] - height / 2,
      width: end[0] - start[0],
      height: height,
    },
    {
      x: params.coordSys.x,
      y: params.coordSys.y,
      width: params.coordSys.width,
      height: params.coordSys.height,
    },
  )

  return (
    rectShape && {
      type: 'rect',
      shape: rectShape,
      style: api.style(),
    }
  )
}

// TODO transform date
const formatDate = (date: Date) => `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`

const getToolTip = props => {
  return {
    show: getChartOption(props, 'showTooltip'),
    trigger: 'item',
    position: pt => {
      return [pt[0] + 10, '10%']
    },
    formatter: function (params) {
      const header = `${params.value[0]}`
      const startDate = new Date(params.value[3])
      const endDate = new Date(params.value[4])
      const subHeader = `${formatDate(startDate)} - ${formatDate(endDate)}`
      const toolTipItems: ToolTipItem[] = []
      toolTipItems.push({
        color: params.value[2],
        nameValue: `${params.seriesName}`,
      })
      return formattedToolTip({ header, subHeader, toolTipItems })
    },
    confine: true,
  }
}

const makeGanttChartOption = (props, theme) => {
  if (!props.data) return {}
  return {
    title: {
      show: false,
    },
    animation: false,
    grid: getGrid(theme),
    xAxis: getXAxis(theme),
    yAxis: getYAxis(theme),
    series: getSeries(props),
    dataZoom: getZoom(props, theme),
    legend: getLegend(props, theme),
    tooltip: getToolTip(props),
  }
}

export interface GanttChartProps {
  height: React.CSSProperties['height']
  data: { series: string; data: [number | string, number | string] }[]
}

export const GanttChart: React.FC<GanttChartProps & EChartsReactProps['option']> = memo(props => {
  const theme = useTheme()
  const chartHeight = props.height - theme.spacing(9)
  const option = makeGanttChartOption(props, theme)

  const { themeName, echartsTheme } = useChartTheme()

  echarts.registerTheme(themeName, echartsTheme)

  return <ReactEcharts theme={themeName} option={option} style={{ height: `${chartHeight}px` }} />
})
