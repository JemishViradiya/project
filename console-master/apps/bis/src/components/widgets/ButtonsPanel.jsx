import React from 'react'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

const ButtonsPanel = ({ buttons, justify = 'center', spacing = 2, ...boxProps }) => (
  <Box p={6} {...boxProps}>
    <Grid container justify={justify} alignItems="center" spacing={spacing}>
      {buttons.map((button, index) => (
        <Grid key={index} item>
          {button}
        </Grid>
      ))}
    </Grid>
  </Box>
)

export default ButtonsPanel
