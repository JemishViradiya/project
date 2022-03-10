/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  dynamicCardContainer: {
    '& > .MuiPaper-root:not(:last-child)': {
      marginBottom: `${theme.spacing(5)}px`,
    },
  },
  outerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(6),
  },
  paperContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '1024px',
  },
}))
