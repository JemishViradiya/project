/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.tooltip + 1,
    color: theme.palette.common.white,
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2),
  },
  icon: {
    display: 'flex',
    alignItems: 'left',
    margin: '0',
    '&:hover': {
      cursor: 'pointer',
    },
  },

  outerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  contentPadding: {
    padding: `${theme.spacing(6)}px`,
  },
  appBar: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.common.white,
    borderBottom: '1px solid ' + theme.palette.divider,
  },
  alignCenter: {
    alignSelf: 'center',
  },
  bottomPadding: {
    paddingBottom: theme.spacing(6),
  },
  overflowAuto: {
    overflow: 'auto',
  },
}))

export default useStyles
