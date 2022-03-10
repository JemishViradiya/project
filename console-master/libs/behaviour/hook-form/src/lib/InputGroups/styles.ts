//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  form: {
    display: 'flex',
  },
  inputGroup: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),

    '& > .MuiFormControl-root': {
      marginRight: theme.spacing(2),
      flex: `1 1 ${theme.spacing(35)}px`,
      minWidth: `${theme.spacing(35)}px`,
      marginBottom: theme.spacing(0),

      '& .MuiInputBase-root': {
        minWidth: `${theme.spacing(35)}px !important`,
      },
    },

    '& .MuiFormControl-root:last-of-type': {
      marginBottom: theme.spacing(0),
    },

    '& .MuiFilledInput-inputHiddenLabel.MuiFilledInput-inputMarginDense': {
      paddingBottom: theme.spacing(2.5),
    },
  },
  removeButtonWrapper: {
    minWidth: theme.spacing(9),
  },
}))
