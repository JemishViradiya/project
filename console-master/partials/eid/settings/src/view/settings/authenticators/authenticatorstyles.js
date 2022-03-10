/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(6),
  },
  gridContainer: {
    padding: theme.spacing(3),
    alignContent: 'center',
  },
  panel: {
    padding: theme.spacing(3),
  },
}))
