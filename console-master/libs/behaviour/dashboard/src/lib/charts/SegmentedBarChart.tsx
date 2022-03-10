/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { memo, useMemo } from 'react'

import { Box, ListItem, makeStyles, Typography, useTheme } from '@material-ui/core'

import { ChartList } from '../dashboard/ChartList'
import type { EnhancedChartEntry, EnhancedChartProps } from './types'

const useStyles = makeStyles(theme => ({
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start !important',

    '& .MuiBarChart-valueLabel': {
      display: 'inline-block',
      position: 'relative',
      top: '-10px',
      color: theme.palette.text.secondary,
      paddingLeft: theme.spacing(2),
    },
  },
  bar: {
    alignItems: 'center',
    display: 'flex',
    marginTop: theme.spacing(1),
    width: '100%',

    '& > .MuiBox-root': {
      display: 'block',
      height: '16px',
      marginRight: theme.spacing(2),
      borderRadius: '1px',
    },
  },
}))

const DEFAULT_CHART_OPTIONS = {
  colorScheme: 'default',
  showLabel: true,
  sort: true,
}

export interface SegmentedBarChartData {
  counts: number[]
  label: string
}

export interface SegmentedBarChartProps extends EnhancedChartProps<SegmentedBarChartData> {
  options?: {
    showLabel?: boolean
    sort?: boolean
    colorScheme?: string
  }
  formatter?: (values: number) => string
}

const getBarTotal = (counts: number[]): number => {
  return counts.reduce((accumulator, entry) => accumulator + entry, 0)
}

const getTotal = (data: SegmentedBarChartProps['data']): number => {
  return data.reduce((accumulator, entry) => accumulator + getBarTotal(entry.counts), 0)
}

const getMax = (data: SegmentedBarChartProps['data']): number => {
  return Math.max(...data.map(entry => getBarTotal(entry.counts)))
}

const getChartData = (data: SegmentedBarChartProps['data'], sort: boolean) => {
  const totalCount = getTotal(data)
  const chartData = sort ? data.sort((a, b) => getBarTotal(b.counts) - getBarTotal(a.counts)) : data

  return { chartData, totalCount }
}

const getBarWidth = (barTotal: number, max: number): number => {
  return max === 0 ? 0 : (barTotal / max) * 100
}

const getSegmentWidth = (count: number, counts: number[], data: SegmentedBarChartProps['data']): number => {
  const barTotal = getBarTotal(counts)
  return barTotal === 0 ? 0 : (count / barTotal) * getBarWidth(barTotal, getMax(data))
}

export const SegmentedBarChart: React.FC<SegmentedBarChartProps> = memo(({ data, options = {}, onInteraction, formatter }) => {
  const classes = useStyles()
  const theme = useTheme()
  const chartOptions = { ...DEFAULT_CHART_OPTIONS, ...options }
  const { chartData, totalCount } = getChartData(data, chartOptions.sort)

  const isClickable = typeof onInteraction === 'function'
  const colors = Object.values(theme.props['colors'].charts[chartOptions.colorScheme || 'default']) as string[]

  const makeBarElement = (item: EnhancedChartEntry<SegmentedBarChartData>) => (
    <Box className={classes.bar}>
      {item.counts.map((count, index) => (
        <Box
          key={'baritem_' + index}
          onClick={isClickable ? () => onInteraction(item) : undefined}
          role="button"
          style={{
            marginRight: index !== item.counts.length - 1 ? '1px' : '8px',
            background: colors[index],
            display: item.counts.length === 0 ? 'none' : 'block',
            flexBasis: `${getSegmentWidth(count, item.counts, data)}%`,
            cursor: isClickable ? 'pointer' : undefined,
          }}
        />
      ))}
      {chartOptions.showLabel && (
        <Typography variant="caption">{formatter ? formatter(getBarTotal(item.counts)) : getBarTotal(item.counts)}</Typography>
      )}
    </Box>
  )

  return useMemo(() => {
    return (
      <ChartList style={{ height: '80%' }}>
        {chartData.map((item, index) => (
          <ListItem disableGutters key={'listitem_' + index} className={classes.listItem}>
            <Typography variant="caption">{item.label}</Typography>
            {makeBarElement(item)}
          </ListItem>
        ))}
      </ChartList>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, totalCount, chartOptions])
})
