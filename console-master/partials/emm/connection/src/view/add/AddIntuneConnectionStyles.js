/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  descriptionContainer: {
    maxWidth: '65%',
  },
  inputsContainer: {
    width: '25%',
    maxWidth: theme.spacing(180),
  },
  outerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.body,
  },
  backdrop: {
    zIndex: theme.zIndex.tooltip + 1,
    color: theme.palette.common.white,
  },
}))
