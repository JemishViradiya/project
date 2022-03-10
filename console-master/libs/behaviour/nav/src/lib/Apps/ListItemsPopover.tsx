/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReferenceObject } from 'popper.js'
import React, { useMemo } from 'react'

import { useTheme } from '@material-ui/core'
import Fade from '@material-ui/core/Fade'
import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'

import { usePointer } from '@ues-behaviour/react'

import type { ResponsiveDrawerTheme } from '../responsiveDrawer'
import { useResponsiveDrawerState, useStyles } from '../responsiveDrawer'
import ListItemLink from './ListItemLink'

export type ListItemPopoverProps = {
  name: string
  icon: unknown
  children?: React.ReactNode
  route?: string
  match?: string
  defaultRoute?: string
  openPop: boolean
  anchorEl: ReferenceObject
  handleClose: () => void
  handleOpen: () => void
  LinkComponent?: any
  isAccountComponent?: boolean
  nestedListHeight?: number
}

export const useListItemPopover = (): [ReferenceObject, boolean, (event: unknown) => void, () => void, () => void] => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [openPop, setOpenPop] = React.useState(false)
  const { open: openDrawer } = useResponsiveDrawerState()

  const pointer = usePointer()
  const parent: HTMLIFrameElement = useMemo(() => {
    if (window.parent !== window) {
      return window.parent.document.querySelector('iframe#uesnav') as HTMLIFrameElement
    }
    return null
  }, [])

  const handleClose = React.useCallback(() => {
    setOpenPop(false)
  }, [])

  const openPopoverMenu = React.useCallback(
    event => {
      if (!openDrawer && pointer === 'mouse') {
        const target = event.currentTarget
        setAnchorEl(target)
        setOpenPop(true)
      }
      if (parent) {
        parent.style.zIndex = '3200'
      }
    },
    [openDrawer, pointer, parent],
  )

  const handleOpen = React.useCallback(() => {
    setOpenPop(true)
  }, [])

  React.useEffect(() => {
    if (parent) {
      if (anchorEl) {
        parent.style.zIndex = '3200'
      } else {
        parent.style.zIndex = '0'
      }
    }
  }, [parent, anchorEl])

  return [anchorEl, openPop, openPopoverMenu, handleClose, handleOpen]
}

const ListItemsPopover = React.memo(
  ({
    name,
    icon: Icon,
    openPop,
    anchorEl,
    handleClose,
    handleOpen,
    route,
    match,
    children = null,
    defaultRoute = null,
    LinkComponent = ListItemLink,
    isAccountComponent = false,
    nestedListHeight = 0,
  }: ListItemPopoverProps) => {
    const { root, nestedList } = useStyles()
    const theme = useTheme() as ResponsiveDrawerTheme

    let maxHeight = anchorEl ? window.innerHeight - anchorEl.getBoundingClientRect().bottom - 5 : 0
    let vOffset = 0

    if (nestedListHeight > 0) {
      const listItemHeight = theme.overrides.MuiResponsiveDrawer.paper['&.MuiDrawer-paper']['& .MuiListItem-theme'].height
      const listHeight = nestedListHeight + listItemHeight
      if (listHeight > maxHeight) {
        vOffset = maxHeight - nestedListHeight
        maxHeight = Math.min(listHeight, window.innerHeight - listItemHeight - 5)
      }
    }

    const popperStyle = React.useMemo(() => ({ zIndex: theme.zIndex.modal }), [theme])

    return (
      <Popper
        id={name + '.popover'}
        open={openPop}
        anchorEl={anchorEl}
        placement={isAccountComponent ? 'bottom-end' : 'right-start'}
        transition
        style={popperStyle}
        modifiers={{
          offset: {
            enabled: true,
            offset: `${vOffset}, 0`,
          },
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <Paper elevation={0} classes={{ root }} onMouseOver={handleOpen} onMouseLeave={handleClose}>
              <List disablePadding>
                <LinkComponent
                  key={name}
                  name={name}
                  route={children ? defaultRoute : route}
                  match={match}
                  disableRipple={!!children}
                  hasChildren={!!children}
                  handleClose={handleClose}
                  onMouseOver={handleOpen}
                  onMouseLeave={handleClose}
                ></LinkComponent>
                {children && (
                  <div className={nestedList} style={{ maxHeight: maxHeight }}>
                    {children}
                  </div>
                )}
              </List>
            </Paper>
          </Fade>
        )}
      </Popper>
    )
  },
)

export default ListItemsPopover
