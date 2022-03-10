// dependencies
import React from 'react'

import { useTheme } from '@material-ui/core'
// components
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'

import { boxFlexCenterProps } from '@ues/assets'

import markdown from './README.md'

export const Linear = () => {
  const linearProgressSize = 40
  const boldLinearProgressSize = 75

  return (
    <Container>
      <Box my={20}>
        <Typography color="primary">Determinate {linearProgressSize}%</Typography>
        <LinearProgress color="primary" value={linearProgressSize} variant="determinate" />
      </Box>
      <Box my={20}>
        <Typography color="secondary" variant="subtitle1">
          Bold Determinate {boldLinearProgressSize}%
        </Typography>
        <LinearProgress color="secondary" value={boldLinearProgressSize} variant="determinate" className="bold-linear-progress" />
      </Box>
    </Container>
  )
}

export const Page = () => {
  const theme = useTheme()
  return (
    <Box
      bgcolor={theme.palette.grey[200]} // just to show the loading container
      height="calc(100vh - 32px)" // -32px due to default padding applied in config.js
      width="100%"
      {...boxFlexCenterProps}
    >
      <Box p={6} borderRadius={2} bgcolor={theme.palette.common.offwhite} flexDirection="column" {...boxFlexCenterProps}>
        <CircularProgress color="secondary" />
        <Box pt={4}>
          <Typography variant="body2" color="textSecondary">
            Loading ...
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default {
  title: 'Progress',
  parameters: {
    notes: markdown,
    controls: {
      hideNoControlsWarning: true,
    },
  },
}
