//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

import { ROW_HEIGHT } from '@ues-info/shared'

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    margin: theme.spacing(6),
    marginTop: theme.spacing(4),
    padding: `${theme.spacing(4)}px ${theme.spacing(5)}px`,
  },
  box: {
    marginBottom: theme.spacing(4),
  },
  numberSelected: {
    paddingTop: theme.spacing(2.5),
  },
  selectedTemplateName: {
    marginBottom: theme.spacing(0.5),
  },
  selectedDataTypeName: {
    marginBottom: theme.spacing(0.5),
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    height: ROW_HEIGHT * 15, // ROW_HEIGHT = 53 in infiniteTableHooks.tsx
    maxHeight: ROW_HEIGHT * 15,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  warning: {
    color: theme.palette.error.main,
    lineHeight: 1,
    marginLeft: theme.spacing(1.5),
  },
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
      padding: 0,

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
  dotText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}))
