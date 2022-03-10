// dependencies
import React from 'react'

import { Typography } from '@material-ui/core'
// components
import Button from '@material-ui/core/Button'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { ArrowCaretDown, BasicExport, BasicUser, ChartGrid, dropdownMenuProps } from '@ues/assets'
import { usePopover } from '@ues/behaviours'

export const Default = () => {
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen, lastAnchorWidth } = usePopover()

  return (
    <>
      <Button onClick={handlePopoverClick} variant="outlined" endIcon={<ArrowCaretDown />}>
        Open Dropdown
      </Button>
      <Menu
        {...dropdownMenuProps}
        anchorEl={popoverAnchorEl}
        getContentAnchorEl={null}
        open={popoverIsOpen}
        onClose={handlePopoverClose}
        PaperProps={{
          style: { minWidth: `${lastAnchorWidth}px` },
        }}
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
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen, lastAnchorWidth } = usePopover()

  return (
    <>
      <Button onClick={handlePopoverClick} variant="outlined" endIcon={<ArrowCaretDown />}>
        Open Dropdown
      </Button>
      <Menu
        {...dropdownMenuProps}
        anchorEl={popoverAnchorEl}
        getContentAnchorEl={null}
        open={popoverIsOpen}
        onClose={handlePopoverClose}
        PaperProps={{
          style: { minWidth: `${lastAnchorWidth}px` },
        }}
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
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen, lastAnchorWidth } = usePopover()

  return (
    <>
      <Button onClick={handlePopoverClick} variant="outlined" endIcon={<ArrowCaretDown />}>
        Open Dropdown
      </Button>
      <Menu
        {...dropdownMenuProps}
        anchorEl={popoverAnchorEl}
        getContentAnchorEl={null}
        open={popoverIsOpen}
        onClose={handlePopoverClose}
        PaperProps={{
          style: { minWidth: `${lastAnchorWidth}px` },
        }}
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
  title: 'ButtonMenu/Default dropdown',
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
}
