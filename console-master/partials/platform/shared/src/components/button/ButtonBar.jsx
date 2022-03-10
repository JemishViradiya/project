/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential. *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { Box, Button, Grid } from '@material-ui/core'

export const ButtonBar = props => {
  const { buttons } = props

  return (
    <Box display="flex" justifyContent="center" alignContent="center" flexWrap="wrap">
      {buttons.map((button, index) => (
        //Make buttons vertical in screen size xs
        <Grid item xs={12} sm="auto" key={index}>
          <Box display="flex" justifyContent="center" px={1} pt={1}>
            <Button {...button}>{button.text}</Button>
          </Box>
        </Grid>
      ))}
    </Box>
  )
}
