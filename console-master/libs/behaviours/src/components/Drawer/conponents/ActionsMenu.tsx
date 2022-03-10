import React from 'react'

import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core'

import { BasicMoreHoriz, getCustomizableDropdownMenuProps } from '@ues/assets'

import { usePopover } from '../../../popovers'
import type { ActionsMenuProps } from '../types'

export const ActionsMenu: React.FC<ActionsMenuProps> = ({ actions }) => {
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const dropdownMenuProps = getCustomizableDropdownMenuProps({ trOrHorizontal: 'right', anOrHorizontal: 'right' })

  return (
    <>
      <IconButton onClick={handlePopoverClick} size="small" role="button">
        <BasicMoreHoriz />
      </IconButton>
      <Menu
        {...dropdownMenuProps}
        anchorEl={popoverAnchorEl}
        getContentAnchorEl={null}
        open={popoverIsOpen}
        onClose={handlePopoverClose}
      >
        {actions.map(action => {
          const { icon, value, onClick } = action

          return (
            <MenuItem key={value} onClick={onClick}>
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              <ListItemText>{value}</ListItemText>
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
