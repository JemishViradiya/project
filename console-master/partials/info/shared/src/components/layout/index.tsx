//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React from 'react'

import { Box } from '@material-ui/core'

import useStyles from './styles'

export const Layout: React.FC = ({ children, ...rest }) => {
  const classes = useStyles()

  return (
    <Box className={classes.root} {...rest}>
      {children}
    </Box>
  )
}
