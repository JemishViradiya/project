/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { memo, useMemo } from 'react'

import { Box, Button, ListItem, makeStyles, Typography } from '@material-ui/core'

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
    flexGrow: 1,
    marginTop: '7px',
    width: '100%',

    '& > .MuiBox-root': {
      background: theme.props['colors'].charts.default.chart1,
      display: 'block',
      height: '16px',
      marginRight: '8px',
      borderRadius: '1px',

      '&.MuiButton-root': {
        borderRadius: '1px',
      },
    },
  },
}))

const DEFAULT_CHART_OPTIONS = {
  showLabel: true,
  sort: true,
}

export interface BarChartData {
  count: number
  label: string
}

export interface BarChartProps extends EnhancedChartProps<BarChartData> {
  options?: {
    showLabel?: boolean
    sort?: boolean
  }
  formatter?: (value: number) => string
}

const getChartData = (data: BarChartProps['data'], sort: boolean) => {
  const totalCount = data.reduce((accumulator, entry) => accumulator + entry.count, 0)
  const chartData = sort ? data.sort((a, b) => b.count - a.count) : data

  return { chartData, totalCount }
}

export const BarChart: React.FC<BarChartProps> = memo(({ data, options = {}, onInteraction, formatter }) => {
  const classes = useStyles()
  const chartOptions = { ...DEFAULT_CHART_OPTIONS, ...options }
  const { chartData, totalCount } = getChartData(data, chartOptions.sort)

  const isClickable = typeof onInteraction === 'function'

  const makeBarElement = (item: EnhancedChartEntry<BarChartData>) => (
    <Box className={classes.bar}>
      <Box
        onClick={isClickable ? () => onInteraction(item) : undefined}
        component={isClickable ? Button : 'div'}
        role="button"
        style={{
          display: item.count === 0 ? 'none' : 'block',
          flexBasis: `${totalCount === 0 ? 0 : (item.count / totalCount) * 100}%`,
        }}
      />
      {chartOptions.showLabel && <Typography variant="caption">{formatter ? formatter(item.count) : item.count}</Typography>}
    </Box>
  )

  return useMemo(() => {
    return (
      <ChartList>
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
