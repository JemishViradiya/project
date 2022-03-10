/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import * as echarts from 'echarts'
import type { EChartsReactProps } from 'echarts-for-react'
import ReactEcharts from 'echarts-for-react'
import moment from 'moment'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { useTheme } from '@material-ui/core'

import type { CustomPaletteChartData, CustomPaletteChartProps, EnhancedChartProps } from './types'
import type { ToolTipItem } from './useChartTheme'
import { formattedToolTip, useChartTheme } from './useChartTheme'
import { remToPx } from './utils'

const heightPerBar = 35
const barWidth = 15

function getDefaultChartColors(theme) {
  return Object.values(theme.props.colors.charts.default)
}

const defaultChartOptions = {
  showLegend: false,
  showTooltip: true,
  showZoom: false,
}

function getChartOption(props, optionName) {
  const optionValue = props[optionName]
  if (typeof optionValue === 'undefined') return defaultChartOptions[optionName]
  return optionValue
}

function getSeries(props, theme) {
  const hasCustomColorPalette = props.customPalette
  const colorPallete = hasCustomColorPalette ? props.customPalette : getDefaultChartColors(theme)

  const series = []
  for (const ds of props.data) {
    series.push({
      name: ds.series,
      type: 'bar',
      stack: 'total',
      itemStyle: {
        color: hasCustomColorPalette ? colorPallete[ds.colorKey] : colorPallete[props.data.indexOf(ds)],
      },
      barWidth: barWidth,
      data: ds.data,
    })
  }
  return series
}

function getToolTip(props, theme) {
  return {
    show: getChartOption(props, 'showTooltip'),
    trigger: 'axis',
    axisPointer: {
      type: 'none',
    },
    appendToBody: true,
    spacing: theme.spacing(3, 2),
    formatter: params => {
      const date = moment(params[0].value[1])
      const header = date.format('ddd M/D/YYYY h:m A')
      const toolTipItems: ToolTipItem[] = []
      params.forEach(item => {
        toolTipItems.push({
          color: item.color,
          nameValue: `${item.seriesName}: ${item.value[0]}`,
        })
      })
      return formattedToolTip({ header, toolTipItems })
    },
  }
}

function getGrid(theme) {
  return {
    left: '1%',
    right: '2%',
    top: '1%',
    bottom: '1%',
    borderColor: theme.palette.divider,
    containLabel: true,
  }
}

function getXAxis(theme) {
  return {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    position: 'top',
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
        color: theme.palette.divider,
      },
    },
    axisLabel: {
      ...theme.typography.overline,
      fontSize: remToPx(theme.typography.overline.fontSize),
      lineHeight: theme.spacing(3),
      color: theme.palette.text.secondary,
    },
  }
}

function getYAxis(theme, count) {
  return {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitNumber: count,
    axisLabel: {
      ...theme.typography.overline,
      margin: theme.spacing(4),
      fontSize: remToPx(theme.typography.overline.fontSize),
      lineHeight: theme.spacing(3),
      color: theme.palette.text.secondary,
      formatter: date => moment(date).format('h A'),
      showMaxLabel: false,
    },
    type: 'time',
    splitLine: {
      show: false,
    },
  }
}

function getOption(props, theme, count) {
  if (!props.data) return {}
  return {
    title: {
      show: false,
    },
    animation: false,
    tooltip: getToolTip(props, theme),
    legend: { show: false },
    grid: getGrid(theme),
    xAxis: getXAxis(theme),
    yAxis: getYAxis(theme, count),
    series: getSeries(props, theme),
  }
}

interface StackedHorizontalBarData extends CustomPaletteChartData {
  series: string
  data: [number | string, number | string] | [number | string, number | string][]
  [key: string]: unknown
}

export interface StackedHorizontalBarProps
  extends EnhancedChartProps<StackedHorizontalBarData>,
    CustomPaletteChartProps<Record<string, string>> {
  additionalProps?: EChartsReactProps['option']
}

export const StackedHorizontalBar: React.FC<StackedHorizontalBarProps> = memo(props => {
  const theme = useTheme()
  const [option, setOption] = useState({})
  const { data, onInteraction } = props
  const count = data[0]?.data?.length || 0
  const chartHeight = count * heightPerBar
  const { themeName, echartsTheme } = useChartTheme()

  echarts.registerTheme(themeName, echartsTheme)

  useEffect(() => {
    setOption(getOption(props, theme, count))
  }, [props, count, theme])

  const isClickable = typeof onInteraction === 'function'
  const onEventsClick = useCallback(
    interaction => onInteraction({ ...data?.[interaction.seriesIndex], dataPointValue: interaction.value }),
    [data, onInteraction],
  )
  const onEvents = useMemo(() => (isClickable ? { click: onEventsClick } : undefined), [isClickable, onEventsClick])

  return useMemo(() => {
    return (
      <div id="barChartWrapper">
        <ReactEcharts theme={themeName} onEvents={onEvents} option={option} style={{ height: `${chartHeight}px` }} />
      </div>
    )
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [option, chartHeight])
})
