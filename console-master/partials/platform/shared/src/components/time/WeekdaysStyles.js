/**
 * BlackBerry Limited proprietary and confidential.
 * Do not reproduce without permission in writing.
 * Copyright (c) 2020 BlackBerry Ltd.
 * All rights reserved.
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    textTransform: 'none',
  },
  label: {
    display: 'inline-block',
    paddingBottom: theme.spacing(1),
  },
  formControl: {
    marginTop: theme.spacing(1),
  },
  marginBottomNone: {
    marginBottom: '0',
  },
}))
