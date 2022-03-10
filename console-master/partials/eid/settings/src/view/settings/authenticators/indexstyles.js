/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  page: {
    padding: theme.spacing(5),
    margin: theme.spacing(6),
  },
  container: {
    padding: theme.spacing(5),
  },
  icon: {
    margin: '0',
    '&:hover': {
      cursor: 'pointer',
    },
    fontSize: '1.25rem',
  },
}))
