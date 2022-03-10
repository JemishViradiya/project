/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

export default makeStyles((theme: Theme) => ({
  indent: {
    paddingLeft: theme.spacing(11),
  },
  separator: {
    paddingBottom: theme.spacing(4),
  },
  separatorThick: {
    paddingBottom: theme.spacing(6),
  },
  separatorTop: {
    paddingTop: theme.spacing(4),
  },
  separatorThickTop: {
    paddingTop: theme.spacing(10),
  },
  separatorThinTop: {
    paddingTop: theme.spacing(2),
  },
  separatorLeft: {
    paddingLeft: theme.spacing(4),
  },
  containerColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  containerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  titleItemRight: {
    float: 'right',
  },
  titleItemRightDetectionEmail: {
    float: 'right',
    marginRight: '12px',
    paddingTop: '15px',
  },
  titleItemRightDetectionNotify: {
    float: 'right',
    marginRight: '20px',
    paddingTop: '15px',
  },
}))
