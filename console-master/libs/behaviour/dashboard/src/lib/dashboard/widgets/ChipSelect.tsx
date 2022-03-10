/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReactNode } from 'react'
import React, { memo, useRef, useState } from 'react'

import { makeStyles } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import MenuList from '@material-ui/core/MenuList'

import { MenuPopper } from './MenuPopper'

const useStyles = makeStyles(theme => ({
  listRoot: {
    maxHeight: '14rem',
    overflow: 'auto',
    outline: 'none',
  },
}))

type ChipSelectProps = {
  label: string
  open: boolean
  toggleOpen: () => void
  handleListKeyDown: (any) => void
  setOpen: (boolean) => void
  children: ReactNode
}

export const ChipSelect = memo(({ label, open, setOpen, toggleOpen, handleListKeyDown, children }: ChipSelectProps) => {
  const styles = useStyles()
  const ref = useRef(null)

  const Menu = () => {
    return (
      <MenuPopper
        id={'id'}
        anchorRef={ref}
        placement={'bottom-end'}
        transformOrigin={'left top'}
        disablePortal={false}
        open={open}
        setOpen={setOpen}
      >
        <MenuList
          disablePadding
          autoFocusItem={open}
          id="menu-list-grow"
          onKeyDown={handleListKeyDown}
          classes={{ root: styles.listRoot }}
        >
          {children}
        </MenuList>
      </MenuPopper>
    )
  }

  return (
    <>
      <Chip size="small" variant="default" label={label} ref={ref} onClick={toggleOpen} />
      <Menu />
    </>
  )
})

type useChipSelectProps = {
  open: boolean
  toggleOpen: () => void
  handleListKeyDown: (any) => void
  setOpen: (boolean) => void
}

export const useChipSelect = (): useChipSelectProps => {
  const [open, setOpen] = useState(false)

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  const toggleOpen = () => {
    setOpen(!open)
  }

  return {
    open: open,
    setOpen: setOpen,
    toggleOpen: toggleOpen,
    handleListKeyDown: handleListKeyDown,
  }
}
