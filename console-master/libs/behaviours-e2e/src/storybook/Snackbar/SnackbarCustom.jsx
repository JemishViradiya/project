/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { Fragment } from 'react'

import { Box, Button } from '@material-ui/core'

import { SnackbarProvider, useSnackbar } from '@ues/behaviours'

import SnackMessage from './components/SnackMessage.js'
import { getRandomText } from './utils.js'

const CustomMessage = args => {
  if (args.horizontalAnchorOrigin !== undefined) {
    args = {
      ...args,
      anchorOrigin: {
        ...args.anchorOrigin,
        horizontal: args.horizontalAnchorOrigin,
      },
    }
  }
  if (args.verticalAnchorOrigin !== undefined) {
    args = {
      ...args,
      anchorOrigin: {
        ...args.anchorOrigin,
        vertical: args.verticalAnchorOrigin,
      },
    }
  }

  const Custom = args => {
    // console.log('Args: ' + JSON.stringify(args))
    const snackbar = useSnackbar()

    const handleOpenCustomSnackbar = props => {
      const messageId = new Date().getTime() + Math.random() + ''
      snackbar.enqueueCustom(null, {
        ...props,
        content: messageId => <SnackMessage messageText={props.messageText} id={messageId} />,
        id: messageId,
      })
    }

    const action = key => (
      <Fragment>
        <Button
          onClick={() => {
            alert(`I belong to snackbar with key ${key}`)
          }}
        >
          'Alert'
        </Button>
        <Button
          onClick={() => {
            snackbar.closeMessage(key)
          }}
        >
          'Dismiss'
        </Button>
      </Fragment>
    )

    const handleOpenCustomAction = props => {
      const messageId = new Date().getTime() + Math.random() + ''
      snackbar.enqueueCustom(props.messageText, {
        ...props,
        action: messageId => action(messageId),
        id: messageId,
        key: messageId,
      })
    }
    return (
      <Box spacing="2m">
        <Button onClick={() => handleOpenCustomSnackbar({ messageText: getRandomText(), ...args })}>Custom snackbar</Button>
        <Box>
          <Button onClick={() => handleOpenCustomAction({ messageText: getRandomText(), ...args })}>Custom action</Button>
        </Box>
      </Box>
    )
  }

  return (
    <SnackbarProvider>
      <Custom {...args} />
    </SnackbarProvider>
  )
}

export const Custom = CustomMessage.bind({})

Custom.args = {
  persist: false,
  autoHideDuration: 5000,
  horizontalAnchorOrigin: 'center',
  verticalAnchorOrigin: 'top',
}

export default {
  title: 'Snackbar/Custom',
  component: CustomMessage,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['success', 'info', 'warning', 'error'],
      },
      defaultValue: 'info',
      description: 'The type of the message',
    },
    persist: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
      description: 'When persist is set to true, the message will not hide automatically and needs to be dismissed manually.',
    },
    autoHideDuration: {
      control: {
        type: 'number',
        min: 1,
      },
      defaultValue: 5000,
      description: 'Auto-hide delay in milliseconds. 1000ms = 1s',
    },
    horizontalAnchorOrigin: {
      control: {
        type: 'select',
        options: ['center', 'left', 'right'],
      },
      description: 'Horizontal position',
      defaultValue: 'center',
    },
    verticalAnchorOrigin: {
      control: {
        type: 'select',
        options: ['center', 'top', 'bottom'],
      },
      description: 'Vertical position',
      defaultValue: 'top',
    },
  },
}

// NOTE: This component is disabled for now. Will be enabled if there is a need for a custom snackbar in the future.
