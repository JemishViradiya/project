/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import classNames from 'classnames'
import type { FC, ReactNode } from 'react'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'

import { makeStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import MenuList from '@material-ui/core/MenuList'
import Icon from '@material-ui/core/SvgIcon'

import { BasicMoreVert as MenuIcon } from '@ues/assets'

import { MenuPopper } from '../widgets/MenuPopper'

const useStyles = makeStyles(theme => ({
  openMenuButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    borderRadius: 0,
    padding: '6px',
  },
}))

type CardMenuProps = {
  id: string
  cardMenuItems: ReactNode[]
}

const DashboardCardMenu: FC<CardMenuProps> = memo(({ id, cardMenuItems }) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const styles = useStyles()

  const handleListKeyDown = useCallback(event => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }, [])

  const cardMenu = () => (
    <MenuPopper
      id={id}
      anchorRef={anchorRef}
      placement={'bottom-end'}
      transformOrigin={'right top'}
      disablePortal={false}
      open={open}
      setOpen={setOpen}
    >
      <MenuList disablePadding autoFocusItem={open} id={'cardMenu_' + id} onKeyDown={handleListKeyDown}>
        {cardMenuItems}
      </MenuList>
    </MenuPopper>
  )

  const menuClassName = useMemo(() => classNames(styles.openMenuButton, 'nodrag', !open ? 'card-menu-icon' : ''), [
    open,
    styles.openMenuButton,
  ])

  const handleToggle = useCallback(() => {
    setOpen(open => !open)
  }, [])

  return (
    <>
      <IconButton
        data-testid={'menuIcon_' + id}
        ref={anchorRef}
        className={menuClassName}
        onClick={handleToggle}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        role="button"
      >
        <Icon component={MenuIcon} />
      </IconButton>
      {open && cardMenu()}
    </>
  )
})

export default DashboardCardMenu
