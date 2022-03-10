//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  warning: {
    color: theme.palette.warning.main,
  },
  success: {
    color: theme.palette.success.main,
  },
  error: {
    color: theme.palette.error.main,
  },
  default: {
    color: theme.palette.text.primary,
  },
}))
