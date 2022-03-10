/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import * as echarts from 'echarts'
import type { EChartsReactProps } from 'echarts-for-react'
import ReactEcharts from 'echarts-for-react'
import type { CustomI18n } from 'i18next'
import { isEmpty } from 'lodash-es'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core'

import { I18nFormats } from '@ues/assets'

import type { CustomPaletteChartData, CustomPaletteChartProps, EnhancedChartProps } from './types'
import type { ToolTipItem } from './useChartTheme'
import { formattedToolTip, useChartTheme } from './useChartTheme'
import { remToPx } from './utils'

const LINE_COLOR = '#eaecee'
const TEXT_COLOR = '#555555'
const DEFAULT_CHART_OPTIONS = {
  showLegend: true,
  showTooltip: true,
  showZoom: false,
}

export interface LineChartData extends CustomPaletteChartData {
  series: string
  data: (number | string)[][]
}

export interface LineChartProps extends EnhancedChartProps<LineChartData>, CustomPaletteChartProps<Record<string, string>> {
  height: number
  additionalProps?: EChartsReactProps['option']
  formatters?: {
    yAxis?: (value: string | number) => string
    xAxis?: (value: string | number) => string
  }
}

type ChartGetterFn = Partial<
  LineChartProps & {
    classes?: Record<string, string>
    optionName?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme?: any
    formatters?: {
      yAxis?: (value: string | number) => string
      xAxis?: (value: string | number) => string
    }
    i18n: CustomI18n
  }
>

const getDefaultChartColors = ({ theme }: ChartGetterFn['theme']) => Object.values(theme.props.colors.charts.default)

const getChartOption = ({ additionalProps, optionName }: ChartGetterFn) => {
  const optionValue = additionalProps[optionName]

  return optionValue === undefined ? DEFAULT_CHART_OPTIONS[optionName] : optionValue
}

const getSeries = ({ data, theme, customPalette }: ChartGetterFn) => {
  const hasCustomColorPalette = !isEmpty(customPalette)
  const colorPalette = hasCustomColorPalette ? customPalette : getDefaultChartColors({ theme })

  return data.map(item => ({
    name: item.series,
    type: 'line',
    smooth: false,
    showSymbol: false,
    itemStyle: {
      color: hasCustomColorPalette ? colorPalette[item.colorKey] : colorPalette[data.indexOf(item)],
    },
    data: item.data,
  }))
}

const getLegend = ({ data, theme, additionalProps }: ChartGetterFn) => {
  return {
    show: getChartOption({ additionalProps, optionName: 'showLegend' }),
    data: data.map(x => x.series),
    icon: 'rect',
    left: 'left',
    bottom: '0px',
    width: '98%',
    type: 'scroll',
  }
}

const getToolTip = ({ additionalProps, i18n }: ChartGetterFn) => {
  return {
    show: getChartOption({ additionalProps, optionName: 'showTooltip' }),
    trigger: 'axis',
    position: pt => {
      return [pt[0] + 10, '10%']
    },
    formatter: function (params) {
      const date = new Date(params[0].value[0])
      const header = i18n?.format(date, I18nFormats.DateTime) ?? ''
      const toolTipItems: ToolTipItem[] = []
      params.forEach(item => {
        toolTipItems.push({
          color: item.color,
          nameValue: `${item.seriesName} : ${item.value[1]}`,
        })
      })
      return formattedToolTip({ header, toolTipItems })
    },
  }
}

const getGrid = ({ theme }) => {
  return {
    left: theme.spacing(1),
    right: theme.spacing(1),
    top: theme.spacing(4),
    bottom: theme.spacing(20),
    borderColor: LINE_COLOR,
    containLabel: true,
  }
}

const getXAxis = ({ theme, formatters }: ChartGetterFn) => {
  return {
    axisLine: {
      lineStyle: {
        color: LINE_COLOR,
      },
    },
    type: 'time',
    boundaryGap: false,
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dotted',
        color: LINE_COLOR,
      },
    },
    axisLabel: {
      ...theme.typography.overline,
      fontSize: remToPx(theme.typography.overline.fontSize),
      lineHeight: theme.spacing(3),
      color: TEXT_COLOR,
      formatter: formatters?.xAxis ?? null,
    },
  }
}

const getYAxis = ({ theme, formatters }: ChartGetterFn) => {
  return {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      ...theme.typography.overline,
      fontSize: remToPx(theme.typography.overline.fontSize),
      lineHeight: theme.spacing(3),
      color: TEXT_COLOR,
      formatter: formatters?.yAxis ?? null,
    },
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dotted',
        color: LINE_COLOR,
      },
    },
  }
}

const getZoom = ({ additionalProps, theme }: ChartGetterFn) => {
  if (!getChartOption({ additionalProps, optionName: 'showZoom' })) {
    return { show: false }
  } else {
    return {
      show: true,
      filterMode: 'none',
      start: 70,
      end: 100,
      bottom: theme.spacing(10),
      left: theme.spacing(0),
      right: theme.spacing(2),
    }
  }
}

const useChartData = ({ data, theme, additionalProps, customPalette, formatters }: ChartGetterFn) => {
  const { i18n } = useTranslation('dashboard')

  if (!data) return {}

  return {
    title: { show: false },
    animation: false,
    tooltip: getToolTip({ additionalProps, i18n }),
    legend: getLegend({ data, theme, additionalProps }),
    grid: getGrid({ theme }),
    xAxis: getXAxis({ theme, formatters }),
    yAxis: getYAxis({ theme, formatters }),
    series: getSeries({ data, theme, customPalette }),
    dataZoom: getZoom({ additionalProps, theme }),
  }
}

export const LineChart: React.FC<LineChartProps> = memo(
  ({ data, height, additionalProps = {}, onInteraction, customPalette, formatters }) => {
    const theme = useTheme()
    const chartData = useChartData({
      data,
      theme,
      additionalProps,
      customPalette,
      formatters,
    })
    const chartHeight = height - theme.spacing(9)
    const { themeName, echartsTheme } = useChartTheme()

    echarts.registerTheme(themeName, echartsTheme)

    const isClickable = typeof onInteraction === 'function'
    const onEventsClick = useCallback(
      interaction => onInteraction({ ...data?.[interaction.seriesIndex], dataPointValue: interaction.value }),
      [data, onInteraction],
    )
    const onEvents = useMemo(() => (isClickable ? { click: onEventsClick } : undefined), [isClickable, onEventsClick])

    return useMemo(() => {
      return (
        <div id="lineChartWrapper">
          <ReactEcharts theme={themeName} onEvents={onEvents} option={chartData} style={{ height: `${chartHeight}px` }} />
        </div>
      )
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [chartData, chartHeight])
  },
)
