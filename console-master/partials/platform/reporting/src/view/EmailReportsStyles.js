/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  root: {
    flex: 'auto',
    padding: theme.spacing(3),
  },
  titlePanel: {
    display: 'flex',
    alignItems: 'center',
  },

  actionPanel: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'flex-end',
  },

  recipients: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
}))
