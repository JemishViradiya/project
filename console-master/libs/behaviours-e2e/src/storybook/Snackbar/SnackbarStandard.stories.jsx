/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { Box, Button, Typography } from '@material-ui/core'

import { SnackbarProvider, useSnackbar } from '@ues/behaviours'

import intro from './Snackbar.md'
import { getRandomText } from './utils.js'

const StandardMessage = args => {
  const Standard = args => {
    const snackbar = useSnackbar()

    const handleOpenSnackbar = props => {
      const message = getRandomText()
      snackbar.enqueueMessage(message, props.variant)
    }

    return (
      <Box>
        <Typography style={{ marginBottom: '20px' }} variant="body1">
          Click on one of the buttons below to display the desired variant of the snackbar:
        </Typography>

        <Box marginBottom="10px">
          <Button onClick={() => handleOpenSnackbar({ variant: 'error' })}>Error</Button>
        </Box>
        <Box marginBottom="10px">
          <Button onClick={() => handleOpenSnackbar({ variant: 'info' })}>Info</Button>
        </Box>
        <Box marginBottom="10px">
          <Button onClick={() => handleOpenSnackbar({ variant: 'warning' })}>Warning</Button>
        </Box>
        <Box marginBottom="10px">
          <Button onClick={() => handleOpenSnackbar({ variant: 'success' })}>Success</Button>
        </Box>
      </Box>
    )
  }

  return (
    <SnackbarProvider>
      <Standard {...args} />
    </SnackbarProvider>
  )
}

export const Standard = StandardMessage.bind({})

export default {
  title: 'Snackbar',
  component: StandardMessage,
  parameters: {
    notes: { Introduction: intro },
  },
}
