import React from 'react'

import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import { BasicHelp } from '@ues/assets'

export const defaultTooltip = () => (
  <Box mt={10}>
    <Tooltip title="More info" aria-label="play" placement="top" enterDelay={600}>
      <IconButton aria-label="play">
        <BasicHelp />
      </IconButton>
    </Tooltip>
  </Box>
)

export default {
  title: 'Tooltip',
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
}
