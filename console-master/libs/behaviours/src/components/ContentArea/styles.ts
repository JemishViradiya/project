//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  contentArea: {
    // Hint: this selector adds margin to all (except first) ContentAreaPanel
    // elements within ContentArea component
    '& > .ues-component-content-area-panel:not(:first-child) > *': {
      marginTop: theme.spacing(6),
    },
  },
}))

export default useStyles
