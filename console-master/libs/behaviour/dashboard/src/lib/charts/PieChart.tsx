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

import { useTheme } from '@material-ui/core'

import type { EnhancedChartProps } from './types'
import { useChartTheme } from './useChartTheme'
import { remToPx } from './utils'

const DEFAULT_OPTIONS: EChartsReactProps['option'] = {
  colorScheme: 'default',
  showLegend: true,
  scrollableLegend: true,
  verticalAlign: true,
  donut: true,
  selectable: true,
}

export interface PieChartData {
  count: number
  label: string
}

export interface PieChartProps extends EnhancedChartProps<PieChartData> {
  title?: string
  height: number
  additionalProps?: EChartsReactProps['option']
  formatter?: (value: number) => string
  colorScheme?: string
}

type ChartGetterFn = Partial<
  PieChartProps & {
    classes?: Record<string, string>
    optionName?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme?: any
    mappedChartData?: { value: number; name: string }[]
  }
>

const getChartOption = ({ additionalProps, optionName }: ChartGetterFn) => {
  const optionValue = additionalProps[optionName]
  if (typeof optionValue === 'undefined') return DEFAULT_OPTIONS[optionName]
  return optionValue
}

const getChartData = ({ data }: ChartGetterFn) => data.map(sector => ({ value: sector.count, name: sector.label }))

const getTotalCount = ({ mappedChartData }: ChartGetterFn) => mappedChartData.reduce((acc, sector) => acc + sector.value, 0)

const getTooltip = ({ tooltipValueFormatter }) => ({
  trigger: 'item',
  formatter: params => `${params.name} ${tooltipValueFormatter ? tooltipValueFormatter(params.value) : params.value}`,
})

const getLegend = ({ mappedChartData, theme, additionalProps }) => {
  return {
    show: getChartOption({ additionalProps, optionName: 'showLegend' }),
    type: getChartOption({ additionalProps, optionName: 'scrollableLegend' }) ? 'scroll' : 'plain',
    orient: getChartOption({ additionalProps, optionName: 'verticalAlign' }) ? 'vertical' : 'horizontal',
    selectedMode: getChartOption({ additionalProps, optionName: 'selectable' }),
    left: getChartOption({ additionalProps, optionName: 'verticalAlign' }) ? 'right' : 'left',
    bottom: '0px',
    height: 'auto',
    width: 'auto',
    align: 'left',
    top: getChartOption({ additionalProps, optionName: 'verticalAlign' }) ? 'middle' : 'bottom',
    formatter: name => {
      return name
    },
    data: mappedChartData.map(x => x.name),
  }
}

const getSeries = ({ title, mappedChartData, theme, additionalProps }) => {
  return [
    {
      name: title,
      type: 'pie',
      avoidLabelOverlap: true,
      center: ['50%', '50%'],
      right:
        getChartOption({ additionalProps, optionName: 'verticalAlign' }) &&
        getChartOption({ additionalProps, optionName: 'showLegend' })
          ? '30%'
          : 'auto',
      radius: getChartOption({ additionalProps, optionName: 'donut' }) ? ['60%', '75%'] : '75%',
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          ...theme.typography.caption,
          fontSize: remToPx(theme.typography.caption.fontSize),
          lineHeight: theme.spacing(4),
          show: getChartOption({ additionalProps, optionName: 'donut' }),
          formatter: params => params.name,
          color: params => params.color,
        },
      },
      labelLine: {
        show: false,
      },
      data: mappedChartData,
    },
  ]
}

const getOption = ({ data, theme, additionalProps, title, formatter }: ChartGetterFn) => {
  const mappedChartData = getChartData({ data })

  return {
    totalCount: getTotalCount({ mappedChartData }),
    tooltip: getTooltip({ tooltipValueFormatter: formatter }),
    color: Object.values(theme.props['colors'].charts[additionalProps.colorScheme || 'default']),
    legend: getLegend({ mappedChartData, theme, additionalProps }),
    series: getSeries({ title, mappedChartData, theme, additionalProps }),
  }
}

export const PieChart: React.FC<PieChartProps> = memo(
  ({ title, data, height, additionalProps = DEFAULT_OPTIONS, formatter, onInteraction }) => {
    const theme = useTheme()
    const chartData = getOption({ data, theme, additionalProps, title, formatter })
    const chartHeight = height - theme.spacing(10)
    const { themeName, echartsTheme } = useChartTheme()

    echarts.registerTheme(themeName, echartsTheme)

    const isClickable = typeof onInteraction === 'function'

    return useMemo(() => {
      return (
        <div id="pieChartWrapper">
          <ReactEcharts
            theme={themeName}
            onEvents={
              isClickable
                ? { click: interaction => onInteraction({ ...data?.[interaction.dataIndex], dataPointValue: interaction.value }) }
                : undefined
            }
            option={chartData}
            style={{ height: `${chartHeight}px` }}
          />
        </div>
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartData, chartHeight])
  },
)
