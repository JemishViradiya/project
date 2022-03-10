//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  container: {
    display: 'flex',
    height: '100%',
    minHeight: 400,
    flexDirection: 'column',
  },
  selectWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: `${theme.spacing(3)}px !important`,
    minWidth: 170,

    '& > div': {
      margin: 0,
      minWidth: 170,
    },
  },
  icon: {
    fontSize: 'medium',
    marginRight: theme.spacing(2),
  },
}))
