//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import type { BoxProps } from '@material-ui/core'
import { Box } from '@material-ui/core'

import useStyles from './styles'

export const ContentArea: React.FC<BoxProps> = ({ children, ...rest }) => {
  const classes = useStyles()

  // Use default properties, if it is not defined by the client
  rest.m = rest.m ?? 6
  rest.display = rest.display ?? 'flex'
  rest.flexDirection = rest.flexDirection ?? 'column'
  rest.alignItems = rest.alignItems ?? 'center'

  return (
    <Box {...rest} className={classes.contentArea}>
      {children}
    </Box>
  )
}
