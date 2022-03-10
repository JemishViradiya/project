//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

const CONJUNCTION_LABEL_WIDTH = 60

export default makeStyles(theme => ({
  conjunctionLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    height: '40px',
    width: `${CONJUNCTION_LABEL_WIDTH}px`,
    marginTop: theme.spacing(1),
  },
  autoHeight: {
    height: 'auto',
  },
  placeholder: {
    marginLeft: `${CONJUNCTION_LABEL_WIDTH}px`,
  },
}))
