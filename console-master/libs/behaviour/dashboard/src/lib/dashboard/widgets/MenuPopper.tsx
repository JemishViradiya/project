/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { FC, MutableRefObject, ReactText } from 'react'
import React, { useCallback, useEffect } from 'react'

import { makeStyles } from '@material-ui/core'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import type { PopperPlacementType } from '@material-ui/core/Popper'
import Popper from '@material-ui/core/Popper'

const useStyles = makeStyles(theme => ({
  menuPopper: {
    paddingTop: theme.spacing(1),
    // boxShadow: theme.shadows[2],
    zIndex: theme.zIndex.modal,
    // boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.02), 0px 4px 5px 0px rgba(0,0,0,0.014), 0px 1px 10px 0px rgba(0,0,0,0.012)',
  },
}))

type MenuPopperProps = {
  id: string
  open: boolean
  setOpen(boolean): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anchorRef: MutableRefObject<any>
  placement: PopperPlacementType
  disablePortal: boolean
  transformOrigin: ReactText
}

export const MenuPopper: FC<MenuPopperProps> = props => {
  const styles = useStyles()

  const { id, anchorRef, placement, transformOrigin, disablePortal, open, setOpen, children } = props

  const closeMenu = useCallback(
    event => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return
      }
      setOpen(false)
    },
    [anchorRef, setOpen],
  )
  const anchorEl = useCallback(() => anchorRef.current, [anchorRef])

  useEffect(() => {
    if (open) {
      const listener = () => setOpen(false)
      document.body.addEventListener('dragstart', listener, { capture: true })
      return () => document.body.removeEventListener('dragstart', listener, { capture: true })
    }
  }, [open, setOpen])

  return (
    <Popper
      data-testid={'menuPopper_' + id}
      className={styles.menuPopper}
      placement={placement}
      open={open}
      anchorEl={anchorEl}
      transition
      disablePortal={disablePortal}
      role={undefined}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: transformOrigin }}>
          <Paper>
            <ClickAwayListener onClickAway={closeMenu}>{children}</ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  )
}
