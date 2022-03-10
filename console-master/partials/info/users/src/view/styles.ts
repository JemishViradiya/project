//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    display: 'flex',
  },
  content: {
    padding: theme.spacing(6),
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
  },
  asLink: {
    '&.MuiLink-underlineHover': {
      textDecoration: 'none !important',
    },
  },
}))
