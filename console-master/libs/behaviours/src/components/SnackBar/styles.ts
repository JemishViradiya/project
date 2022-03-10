/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

export default makeStyles((theme: Theme & { palette: { alert: { error: string; warning: string } } }) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(1),
    },
  },
  card: {
    width: '100%',
    display: 'flex',
    color: 'white',
    // backgroundColor: theme.palette['snackbar']['background'],
    position: 'relative',
  },
  containerBox: {
    width: '400px',
  },

  successBackground: {
    // backgroundColor: theme.palette['snackbar']['background'],
    backgroundColor: theme.palette.success.main,
    padding: `${theme.spacing(3)}px ${theme.spacing(4)}px`,
  },
  infoBackground: {
    // backgroundColor: theme.palette['snackbar']['background'],
    backgroundColor: theme.palette.info.main,
    padding: `${theme.spacing(3)}px ${theme.spacing(4)}px`,
  },
  errorBackground: {
    // backgroundColor: theme.palette['snackbar']['background'],
    backgroundColor: theme.palette.error.main,
    padding: `${theme.spacing(3)}px ${theme.spacing(4)}px`,
  },
  warningBackground: {
    backgroundColor: theme.palette.warning.main,
    padding: `${theme.spacing(3)}px ${theme.spacing(4)}px`,
  },
  errorIcon: {
    color: theme.palette.secondary.contrastText,
  },
  infoIcon: {
    backgroundColor: theme.palette.info.main,
  },
  warningIcon: {
    backgroundColor: theme.palette.warning.main,
  },
  successIcon: {
    backgroundColor: theme.palette.success.main,
  },
  actionRoot: {
    width: '100%',
  },
  startIcon: {
    marginRight: theme.spacing(2),
    alignSelf: 'flex-start',
  },
  endIcon: {
    marginLeft: 'auto',
  },
  closeIcon: {
    color: theme.palette.secondary.contrastText,
  },
  closeIconButton: {
    padding: '.5rem',
    '& span': {
      '& svg.MuiSvgIcon-root': {
        fontSize: '1.25rem',
      },
    },
  },
  label: {},
  rootLegacy: {
    '& div': {
      '&.MuiAlert-icon': {
        alignItems: 'baseline',
      },
    },
  },
}))
