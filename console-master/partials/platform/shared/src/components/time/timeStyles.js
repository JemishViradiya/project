/**
 * BlackBerry Limited proprietary and confidential
 * Do not reproduce without permission in writing
 * Copyright (c) 2020 BlackBerry Ltd
 * All rights reserved
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    margin: theme.spacing(3),
    display: 'inline-block',
  },

  timePickerWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },

  timePickerLabel: {
    display: 'block',
    paddingBottom: theme.spacing(1),
  },

  timeInput: {
    padding: theme.spacing(0),
  },

  formControl: {
    display: 'flex',
    flexDirection: 'column',
  },

  toLabel: {
    margin: 'auto',
    padding: [[theme.spacing(5), theme.spacing(1)]],
    display: 'inline-block',
  },

  titleLabel: {
    paddingBottom: theme.spacing(1),
  },
  timeRangeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: 'fit-content',
  },
}))
