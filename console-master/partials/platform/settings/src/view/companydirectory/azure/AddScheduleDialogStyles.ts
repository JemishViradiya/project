/**
 * BlackBerry Limited proprietary and confidential.
 * Do not reproduce without permission in writing.
 * Copyright (c) 2020 BlackBerry Ltd.
 * All rights reserved.
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(7),
  },
  formControl: {
    flexDirection: 'row',
  },

  selectField: {
    width: theme.spacing(12),
  },

  textField: {
    width: theme.spacing(8),
  },

  root: {
    display: 'flex',
    flexDirection: 'column',
  },

  dialogActions: {
    justifyContent: 'flex-end',
  },
  noMarginField: {
    '& div': {
      '&.MuiFormControl-marginNormal': {
        marginTop: 0,
      },
    },
  },
  sectionSpacer: {
    marginTop: theme.spacing(7),
  },
  numericInput: {
    '& div': {
      '&.MuiInputBase-root': {
        maxWidth: '15ch',
      },
    },
  },
  alert: {
    marginBottom: theme.spacing(6),
  },
  noMarginBottom: {
    marginBottom: '0',
  },
}))
