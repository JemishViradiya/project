//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  formControl: {
    marginRight: theme.spacing(4),
  },
  menuList: {
    paddingTop: theme.spacing(1),
  },
  menuPaper: {
    marginTop: theme.spacing(0.5),
  },
  select: {
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center',
    border: '1px solid',
    borderColor: theme.palette.grey[400],
  },
  selectMenu: {
    ...theme.typography.body2,
  },
  selectIcon: {
    right: theme.spacing(1),
  },
}))
