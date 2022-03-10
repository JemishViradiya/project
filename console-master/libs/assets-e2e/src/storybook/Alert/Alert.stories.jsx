import React from 'react'

import { Box, Chip } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
// components
import Alert from '@material-ui/lab/Alert'

// icons
import { BasicInfo, StatusLow, StatusMedium } from '@ues/assets'

export const Error = () => {
  return (
    <Alert variant="outlined" severity="error" icon={<StatusLow />}>
      <Box pb={2}>
        <Typography variant="subtitle2">This is an error alert</Typography>
      </Box>
      <Typography variant="body2">
        Both padding and alignment should be adjustable. In this case, the heading + content is left-aligned. Lorem ipsum dolor sit
        amet.
      </Typography>
    </Alert>
  )
}

export const Warning = () => {
  return (
    <Alert variant="outlined" severity="warning" icon={<StatusMedium />}>
      <Box pb={2}>
        <Typography variant="subtitle2">This is a warning alert</Typography>
      </Box>
      <Typography variant="body2">
        Both padding and alignment should be adjustable. In this case, the heading + content is left-aligned. Lorem ipsum dolor sit
        amet.
      </Typography>
    </Alert>
  )
}

export const Info = () => {
  return (
    <Alert variant="outlined" severity="info" icon={<BasicInfo />}>
      <Box pb={2}>
        <Typography variant="subtitle2">This is an info alert</Typography>
      </Box>
      <Typography variant="body2">
        Both padding and alignment should be adjustable. In this case, the heading + content is left-aligned. Lorem ipsum dolor sit
        amet.
      </Typography>
    </Alert>
  )
}
export const AlertChips = () => (
  <Box>
    <Chip label="Critical" className="alert-chip-critical" />
    <br />
    <Chip label="High" className="alert-chip-high" />
    <br />
    <Chip label="Med" className="alert-chip-medium" />
    <br />
    <Chip label="Low" className="alert-chip-low" />
    <br />
    <Chip label="Info" className="alert-chip-info" />
    <br />
    <Chip label="Secure" className="alert-chip-secure" />
  </Box>
)

export default {
  title: 'Alert',
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
}
