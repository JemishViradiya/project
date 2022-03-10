/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  syncStateDiv: {
    display: 'flex',
  },
  icon: {
    fontSize: '1.25rem',
  },
  info: {
    color: theme.palette.info.main,
  },
  success: {
    color: theme.palette.success.main,
  },
  error: {
    color: theme.palette.error.main,
  },
  img: {
    marginRight: theme.spacing(1.5),
    fontSize: '1.25rem',
  },
  syncStatusImg: {
    display: 'flex',
    alignItems: 'flex-end',
    fontSize: '1.25rem',
  },
  outerContainer: {
    margin: theme.spacing(6),
  },

  descriptionLabel: {
    paddingBottom: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.snackbar,
  },
  syncStatusLabel: {
    marginLeft: '8px',
  },
  link: {
    marginLeft: '34px',
  },
  circularProgress: {
    marginTop: '4px',
    fontSize: '1.25rem',
  },
  content: {
    width: '100%',
    padding: theme.spacing(6),
  },
}))
