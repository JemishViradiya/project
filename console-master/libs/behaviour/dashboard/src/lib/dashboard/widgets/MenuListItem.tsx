/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReactElement } from 'react'
import React from 'react'

import type { MenuItemProps } from '@material-ui/core'
import { makeStyles, MenuItem } from '@material-ui/core'

const useMenuItemStyles = makeStyles(theme => ({
  root: {
    ...theme.typography.body2,
  },
}))

export const MenuListItem = (props: MenuItemProps): ReactElement => {
  const classes = useMenuItemStyles()

  return <MenuItem {...(props as unknown)} classes={classes} />
}
