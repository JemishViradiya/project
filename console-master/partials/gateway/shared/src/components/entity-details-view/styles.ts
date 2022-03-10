//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

const MARGIN_FROM_BUTTONS_PANEL = 25

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

    '& .ues-component-content-area-panel:last-of-type': {
      marginBottom: theme.spacing(MARGIN_FROM_BUTTONS_PANEL),
    },
  },
}))
