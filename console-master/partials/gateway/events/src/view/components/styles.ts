//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    display: 'flex',

    '& .MuiTableCell-head > .MuiBox-root': {
      flex: 1,
      justifyContent: 'space-between',
    },

    '& .MuiTableCell-root:not(.MuiTableCell-head)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflowY: 'hidden',
      padding: `0 ${theme.spacing(6)}px ${theme.spacing(0.5)}px`,

      '& > p, & > span': {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: '100%',
      },
    },
  },
  content: {
    padding: theme.spacing(6),
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
  },
}))
