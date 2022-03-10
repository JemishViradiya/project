/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo } from 'react'

import type { SvgIcon, Theme } from '@material-ui/core'
import { Box, makeStyles, Typography } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'

import { StatusMedium } from '@ues/assets'

const useStyles = makeStyles<Theme, { color: string }>(theme => ({
  icon: {
    color: ({ color }) => color,
    paddingRight: theme.spacing(2),
    width: '48px',
    height: '48px',
  },
}))

export interface StatsCountProps {
  id: string
  data: number
  color: string
  timeLabel: string
  disableIntervalSelection?: boolean
  icon?: typeof SvgIcon
}

export const StatsCount: React.FC<StatsCountProps> = memo(props => {
  const classes = useStyles({ color: props.color })

  const Icon: typeof SvgIcon = props.icon || StatusMedium

  const { data, timeLabel } = props

  return (
    <Box display="flex" justifyContent="space-between">
      <Box display="flex" alignItems="center">
        <Icon className={classes.icon} />
        <Typography variant="h1">{data}</Typography>
      </Box>
      <Chip size="small" variant="default" label={timeLabel} clickable={false} />
    </Box>
  )
})
