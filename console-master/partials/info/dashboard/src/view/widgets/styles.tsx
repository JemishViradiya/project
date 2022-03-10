//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  chartContainer: {
    height: '100%',
    paddingTop: 0,
    paddingBottom: theme.spacing(4),
  },
  chartHeader: {
    paddingBottom: 0,
    justifyContent: 'flex-end',
  },
  totalStatsWrapper: {
    padding: '0px', // TODO set zero padding for left, right, bottom directoion regarding UX
  },
  totalCountWrapper: {
    '& h1': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
}))
