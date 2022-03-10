//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(theme => ({
  switch: {
    width: 'fit-content',
  },
  checkbox: {
    width: 'fit-content',
  },
  select: {
    maxWidth: '960px',
  },
  multiSelect: {
    maxWidth: '960px',
  },
  multiSelectLabel: {
    marginTop: theme.spacing(1),
  },
  multiSelectEndIcon: {
    '& .MuiAutocomplete-endAdornment': {
      display: 'none',
    },
  },
  sliderHelperText: {
    marginRight: theme.spacing(3.5),
    marginLeft: theme.spacing(3.5),
    marginTop: theme.spacing(1),
  },
  disabledHelperText: {
    color: theme.palette.text.disabled,
  },
}))

export const themeOverrides = (theme: Theme) => ({})
