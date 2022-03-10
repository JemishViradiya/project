/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  nested: {
    marginLeft: theme.spacing(12),
  },
  sectionSpacing: {
    marginTop: theme.spacing(6),
  },
  fieldSpacing: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  item: {
    margin: 0,
  },
  numericInput: {
    '& div': {
      '&.MuiInputBase-root': {
        maxWidth: '15ch',
      },
    },
  },
  syncInput: {
    marginTop: '0',
  },
}))
