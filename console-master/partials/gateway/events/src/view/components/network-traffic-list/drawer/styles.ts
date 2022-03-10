//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core/styles'

import type { UesTheme } from '@ues/assets'

export const useStyles = makeStyles<UesTheme>(theme => ({
  title: {
    paddingLeft: theme.spacing(6),
    paddingBottom: theme.spacing(2),
  },
  closeIcon: {
    marginLeft: 'auto',
    marginBottom: theme.spacing(2),
  },
  paper: {
    backgroundColor: theme.palette.background.body,
    width: theme.spacing(150),
  },
  alertIcon: {
    marginRight: theme.spacing(2),
  },
}))
