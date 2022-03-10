//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
  },
  hidden: {
    visibility: 'hidden',
  },
}))
