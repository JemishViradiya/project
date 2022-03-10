//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React from 'react'

import { Box } from '@material-ui/core'

import useStyles from './styles'

export interface ToolbarProps {
  begin?: React.ReactNode
  center?: React.ReactNode
  end?: React.ReactNode
}

const Toolbar: React.FC<ToolbarProps> = ({ begin, center, end }) => {
  const classes = useStyles()

  return (
    <Box className={classes.toolbar}>
      <Box>{begin}</Box>
      <Box>{center}</Box>
      <Box>{end}</Box>
    </Box>
  )
}

export { Toolbar }
