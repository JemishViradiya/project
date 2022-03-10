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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.body,
  },
  syncStateDiv: {
    display: 'flex',
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
  syncStatusLink: {
    marginLeft: theme.spacing(1.5),
  },
  circularProgress: {
    marginTop: theme.spacing(1),
  },
  icon: {
    display: 'flex',
    alignItems: 'left',
    margin: '0',
    '&:hover': {
      cursor: 'pointer',
    },
    fontSize: '1.25rem',
  },
  container: {
    padding: 0,
    flexGrow: 1,
  },
  table: {
    minWidth: '700px',
  },
  tableHead: {
    paddingLeft: 0,
    paddingTop: theme.spacing(3),
  },
  descriptionLabel: {
    paddingBottom: theme.spacing(3),
  },
  link: {
    color: theme.palette.info.light,
  },
  backdrop: {
    zIndex: theme.zIndex.snackbar,
  },
}))
