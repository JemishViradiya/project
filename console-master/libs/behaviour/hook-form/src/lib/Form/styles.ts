//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    '& .MuiFormControl-root': {
      marginBottom: theme.spacing(4),
    },
    '& .MuiFormControl-root:last-of-type': {
      marginBottom: theme.spacing(0),
    },
  },
  formButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(6),
    '& button:first-of-type': {
      marginRight: theme.spacing(2),
    },
  },
}))
