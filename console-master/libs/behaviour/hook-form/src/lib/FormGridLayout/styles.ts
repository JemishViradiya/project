//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  columnLabel: {
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    height: theme.spacing(10),

    '& button': {
      marginLeft: theme.spacing(2),
    },
  },
  gridItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(1),
  },
  actionButtonGridItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    textAlign: 'right',

    '& .MuiIconButton-root': {
      marginTop: theme.spacing(2),
    },
  },
}))
