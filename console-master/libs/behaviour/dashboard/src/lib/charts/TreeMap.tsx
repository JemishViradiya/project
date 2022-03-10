import * as echarts from 'echarts'
import type { EChartsReactProps } from 'echarts-for-react'
import ReactEcharts from 'echarts-for-react'
import React, { memo, useMemo } from 'react'

import { useTheme } from '@material-ui/core'

import { useChartTheme } from './useChartTheme'
import { remToPx } from './utils'

const defaultOptions: EChartsReactProps['option'] = {
  showLegend: true,
  scrollableLegend: true,
  verticalAlign: true,
  radius: '10%',
  // donut: true,
  selectable: true,
}

function getChartOption(props, name) {
  const optionValue = props[name]
  if (typeof optionValue === 'undefined') return defaultOptions[name]
  return optionValue
}

function getChartData(data) {
  return data.series
}

function getTooltip(theme) {
  return {
    trigger: 'item',
    formatter: (params, ticket, callback) => {
      return `${params.name} ${params.value}`
    },
    textStyle: {
      ...theme.typography.caption,
      fontSize: remToPx(theme.typography.caption.fontSize),
      lineHeight: remToPx(theme.typography.caption.lineHeight),
    },
  }
}

function getSeries(title, chartData, theme, additionalProps) {
  return [
    {
      // name: title,
      type: 'treemap',
      avoidLabelOverlap: true,
      center: ['50%', '50%'],
      width: '95%',
      height: '95%',
      // right: getChartOption(additionalProps, 'verticalAlign') && getChartOption(additionalProps, 'showLegend') ? '30%' : 'auto',
      // hoverOffset: 8,
      data: chartData,
      leafDepth: null,
      roam: false,
      nodeClick: false,
      breadcrumb: {
        show: false,
      },
      levels: [
        {
          itemStyle: {
            gapWidth: theme.spacing(0.5),
          },
        },
        {
          itemStyle: {
            gapWidth: theme.spacing(0.5),
          },
        },
        {
          itemStyle: {
            gapWidth: theme.spacing(0.5),
          },
        },
      ],
    },
  ]
}

function getOption(data, theme, additionalProps) {
  const chartData = getChartData(data)
  return {
    // totalCount: getTotalCount(data),
    // tooltip: getTooltip(theme),
    // color: Object.values(theme.props['colors'].charts),
    legend: {
      show: false,
    },
    series: getSeries(data.title, chartData, theme, additionalProps),
  }
}

export interface TreeMapProps {
  height: number
  data: {
    title?: string
    series:
      | number[]
      | {
          name: string
          value: number
        }[]
  }
  additionalProps?: EChartsReactProps['option']
}

export const TreeMap: React.FC<TreeMapProps> = memo(({ data, height, additionalProps = defaultOptions }) => {
  const theme = useTheme()
  const chartData = getOption(data, theme, additionalProps)
  const chartHeight = height - theme.spacing(4) - 1
  const { themeName, echartsTheme } = useChartTheme()

  echarts.registerTheme(themeName, echartsTheme)

  return useMemo(() => {
    return (
      <div id="pieChartWrapper">
        <ReactEcharts theme={themeName} option={chartData} style={{ height: `${chartHeight}px` }} />
      </div>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, height])
})
