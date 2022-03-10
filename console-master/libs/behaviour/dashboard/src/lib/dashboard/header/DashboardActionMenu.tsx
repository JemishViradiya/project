/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ElementType, ReactNode } from 'react'
import React, { memo, useCallback, useMemo, useRef } from 'react'

import { makeStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import MenuList from '@material-ui/core/MenuList'
import Icon from '@material-ui/core/SvgIcon'

import { MenuPopper } from './../widgets/MenuPopper'
import { useActionMenu } from './useActionMenu'

const useStyles = makeStyles(theme => ({
  iconButton: {
    marginLeft: theme.spacing(1.5),
    padding: '6px',
  },
}))

export interface ActionMenuProps {
  icon: ElementType
  tooltip?: string
  children?: ReactNode
}

export const DashboardActionMenu = memo(({ icon, tooltip, children }: ActionMenuProps) => {
  const styles = useStyles()
  const ref = useRef(null)
  const { open, setOpen, toggleOpen, handleListKeyDown } = useActionMenu()

  const Menu = useCallback(() => {
    return (
      <MenuPopper
        id={'id'}
        anchorRef={ref}
        placement={'bottom-end'}
        transformOrigin={'right top'}
        disablePortal={false}
        open={open}
        setOpen={setOpen}
      >
        <MenuList disablePadding autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
          {children}
        </MenuList>
      </MenuPopper>
    )
  }, [children, handleListKeyDown, open, setOpen])

  return useMemo(() => {
    return (
      <IconButton ref={ref} className={styles.iconButton} onClick={toggleOpen} aria-haspopup="true" title={tooltip} role="button">
        <Icon component={icon} />
        <Menu />
      </IconButton>
    )
  }, [Menu, icon, styles.iconButton, toggleOpen, tooltip])
})
