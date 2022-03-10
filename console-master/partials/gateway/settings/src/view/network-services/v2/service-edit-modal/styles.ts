//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  formButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(6),

    '& button:first-of-type': {
      marginRight: theme.spacing(2),
    },
  },
}))
