//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  box: {
    display: 'flex',
    alignItems: 'center',
  },
  textField: {
    maxWidth: 85,
    marginRight: theme.spacing(2),

    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: theme.spacing(0),
    },

    '& input[type=number]': {
      '-moz-appearance': 'textfield',
    },
  },

  slider: {
    marginRight: theme.spacing(2),
  },

  textFieldInput: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: theme.spacing(0),
    },

    '& input[type=number]': {
      '-moz-appearance': 'textfield',
    },
  },
}))
