//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import type { BoxProps } from '@material-ui/core'
import { Box, CircularProgress } from '@material-ui/core'

const LoadingProgress: React.FC<BoxProps> = props => (
  <Box {...props}>
    <CircularProgress color="secondary" />
  </Box>
)

export { LoadingProgress }
