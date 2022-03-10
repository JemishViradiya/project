/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexGrow: 1,
    width: '100%',
  },

  tabPanel: {
    flexGrow: 1,
    alignSelf: 'center',
  },

  root: {
    textTransform: 'none',
  },

  container: {
    maxHeight: '440px',
  },

  table: {
    minWidth: '700px',
  },

  textField: {
    width: '25ch',
  },

  button: {
    margin: theme.spacing(1),
  },

  nested: {
    paddingLeft: theme.spacing(2),
  },

  backdrop: {
    zIndex: theme.zIndex.snackbar,
  },
}))

export default useStyles
