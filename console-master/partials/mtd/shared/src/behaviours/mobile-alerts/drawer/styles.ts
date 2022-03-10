/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { makeStyles } from '@material-ui/core/styles'

import type { UesTheme } from '@ues/assets'

export const useStyles = makeStyles<UesTheme>(theme => ({
  title: {
    paddingLeft: '24px',
    paddingBottom: '8px',
  },
  closeIcon: {
    marginLeft: 'auto',
    marginBottom: '39px',
  },
  paper: {
    backgroundColor: theme.palette.background.body,
    width: '600px',
  },
}))
