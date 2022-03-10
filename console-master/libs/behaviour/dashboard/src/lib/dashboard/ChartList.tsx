/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import type { ListProps } from '@material-ui/core'
import { List } from '@material-ui/core'
import type { Theme } from '@material-ui/core/styles'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import { useChartColors } from './ChartStyles'

const useStyles = makeStyles<Theme, ReturnType<typeof useChartColors>['chartListColor']>(theme => ({
  root: {
    height: '100%',
  },
}))

export const ChartList: React.FC<ListProps> = ({ children, ...rest }) => {
  const theme = useTheme()
  const chartListColors = useChartColors(theme).chartListColor

  const classes = useStyles(chartListColors)

  return (
    <List disablePadding {...rest} className={classes.root}>
      {children}
    </List>
  )
}
