/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  outerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.body,
  },
  descriptionContainer: {
    maxWidth: '65%',
  },
  inputsContainer: {
    width: '30%',
    maxWidth: theme.spacing(180),
  },
  inputsInfoTitle: {
    fontWeight: 'bold',
    fontSize: theme.spacing(5),
  },
  circularProgress: {
    marginTop: theme.spacing(1),
  },
  backdrop: {
    zIndex: theme.zIndex.snackbar,
  },
}))
