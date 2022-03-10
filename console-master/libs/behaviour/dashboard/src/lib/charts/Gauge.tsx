import * as echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import React, { memo, useMemo } from 'react'

import { useTheme } from '@material-ui/core'

import type { GaugeData } from './types'
import { useChartTheme } from './useChartTheme'

const getSeries = (data, theme, color, min, max) => [
  {
    type: 'gauge',
    detail: {
      show: true,
      valueAnimation: true,
      fontSize: theme.typography.h1.fontSize,
      fontFamily: theme.typography.h1.fontFamily,
      fontWeight: theme.typography.h1.fontWeight,
      color: theme.palette.text.primary,
      offsetCenter: [0, '-8px'],
      formatter: value => `${value}%`,
    },
    labelLine: {
      show: false,
    },
    progress: {
      show: true,
      width: 36,
      itemStyle: {
        color,
      },
    },
    data,
    min,
    max,
    radius: '100%',
    center: ['50%', '75%'],
    startAngle: 180,
    endAngle: 0,
    splitNumber: 1,
    axisLine: {
      show: true,
      lineStyle: {
        width: 36,
        color: [[1, theme.palette.divider]],
      },
    },
    axisLabel: {
      show: true,
      color: theme.palette.text.secondary,
      fontSize: theme.typography.caption.fontSize,
      fontFamily: theme.typography.caption.fontFamily,
      fontWeight: theme.typography.caption.fontWeight,
      distance: -35,
      padding: [0, -12, 0, 0],
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    pointer: {
      show: false,
    },
  },
]

interface GaugeProps {
  data: Array<GaugeData>
  color: string
  min: number
  max: number
  height: number
}

const Gauge: React.FC<GaugeProps> = memo(({ data, color, min, max, height }) => {
  const theme = useTheme()
  const { themeName, echartsTheme } = useChartTheme()
  const chartHeight = height - theme.spacing(12)

  echarts.registerTheme(themeName, echartsTheme)

  return useMemo(
    () => (
      <ReactEcharts
        theme={themeName}
        option={{
          series: getSeries(data, theme, color, min, max),
        }}
        style={{ height: `${chartHeight}px` }}
      />
    ),
    [data, theme, themeName, color, min, max, chartHeight],
  )
})

export { Gauge, GaugeProps }
