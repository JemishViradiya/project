// dependencies
import React from 'react'

import { Typography } from '@material-ui/core'
// components
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { ArrowChevronDown, BasicExport, BasicUser, ChartGrid, dropdownMenuProps } from '@ues/assets'
import { usePopover } from '@ues/behaviours'

export const Icon = () => {
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  return (
    <>
      <IconButton onClick={handlePopoverClick}>
        <ArrowChevronDown />
      </IconButton>
      <Menu
        {...dropdownMenuProps}
        anchorEl={popoverAnchorEl}
        getContentAnchorEl={null}
        open={popoverIsOpen}
        onClose={handlePopoverClose}
      >
        <MenuItem onClick={handlePopoverClose}>Profile</MenuItem>
        <MenuItem onClick={handlePopoverClose} disabled>
          My Account
        </MenuItem>
        <MenuItem onClick={handlePopoverClose}>Logout</MenuItem>
      </Menu>
    </>
  )
}

export const WithItemIcons = () => {
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  return (
    <>
      <IconButton onClick={handlePopoverClick}>
        <ArrowChevronDown />
      </IconButton>
      <Menu
        {...dropdownMenuProps}
        anchorEl={popoverAnchorEl}
        getContentAnchorEl={null}
        open={popoverIsOpen}
        onClose={handlePopoverClose}
      >
        <MenuItem onClick={handlePopoverClose}>
          <ListItemIcon>
            <BasicUser />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePopoverClose} disabled>
          <ListItemIcon>
            <ChartGrid />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePopoverClose}>
          <ListItemIcon>
            <BasicExport />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export const WithLongItem = () => {
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  return (
    <>
      <IconButton onClick={handlePopoverClick}>
        <ArrowChevronDown />
      </IconButton>
      <Menu
        {...dropdownMenuProps}
        anchorEl={popoverAnchorEl}
        getContentAnchorEl={null}
        open={popoverIsOpen}
        onClose={handlePopoverClose}
      >
        <MenuItem onClick={handlePopoverClose}>Profile</MenuItem>
        <MenuItem onClick={handlePopoverClose} disabled>
          My Account
        </MenuItem>
        <MenuItem onClick={handlePopoverClose}>Logout</MenuItem>
        <MenuItem onClick={handlePopoverClose}>
          <Typography noWrap>
            Really Long Text, Like Really Really Long (at least for a menu item anyway) - Shrink Window to See Me Truncate
          </Typography>
        </MenuItem>
      </Menu>
    </>
  )
}

export default {
  title: 'ButtonMenu/Icon',
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
}
