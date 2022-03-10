//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  tableContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  tableStickyActions: {
    height: 0,
  },
  expandableRowItem: {
    '&:nth-of-type(1)': {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(3),
    paddingLeft: 0,
  },
  expandableRowTitle: {
    textTransform: 'uppercase',
    paddingBottom: theme.spacing(1),
  },
  riskChip: {
    marginLeft: theme.spacing(2),
  },
}))
