//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

const INDENT_BASE_UNIT = 6

export default makeStyles(theme => ({
  primary: {},
  secondary: {
    marginLeft: theme.spacing(INDENT_BASE_UNIT),
  },
  tertiary: {
    marginLeft: theme.spacing(INDENT_BASE_UNIT * 2),
  },
  error: {
    color: theme.palette.error.main,
  },
}))
