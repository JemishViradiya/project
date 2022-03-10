//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core/styles'

import { WIDGET_TABS_HEIGHT } from '../../widget-tabs'

const useStyles = makeStyles(theme => ({
  toolbar: {
    marginBottom: theme.spacing(2),
    height: `${WIDGET_TABS_HEIGHT}px`,
  },
}))

export default useStyles
