/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  outerContainer: {
    width: '100%',
    height: `calc(100% - ${theme.spacing(17)}px)`,
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTableCell-head > .MuiBox-root': {
      flex: 1,
      justifyContent: 'space-between',
    },
    '& .MuiTableCell-head': {
      overflowY: 'hidden',
    },
    '& .MuiTableCell-root:not(.MuiTableCell-head)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      overflowY: 'hidden',
    },
  },
  cardContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(6),
  },
}))
