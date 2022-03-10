//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import { Box, Divider, IconButton, Menu, MenuItem } from '@material-ui/core'

import { BasicAddRound } from '@ues/assets'
import { AriaElementLabel } from '@ues/assets-e2e'
import { usePopover } from '@ues/behaviours'

interface DropdownMenuItem {
  label: string
  hidden?: boolean
  disabled?: boolean
  onClick?: () => void
}

interface DropdownProps {
  buttonIcon?: React.ReactNode
  disabled?: boolean
  items?: DropdownMenuItem[]
  itemGroups?: { items: DropdownMenuItem[] }[]
}

const Dropdown: React.FC<DropdownProps> = ({ disabled, buttonIcon = <BasicAddRound />, items, itemGroups }) => {
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen, lastAnchorWidth } = usePopover()
  const shouldDisableButton = disabled || !(items || itemGroups)

  const handleMenuItemClick = (item: DropdownMenuItem) => {
    handlePopoverClose()

    if (item.onClick) {
      item.onClick()
    }
  }

  const renderItems = () => {
    const renderSingleItems = () =>
      items?.map((item, index) => (
        <MenuItem key={index} disabled={item.disabled} hidden={item.hidden} onClick={() => handleMenuItemClick(item)}>
          {item.label}
        </MenuItem>
      ))

    const renderItemGroups = () =>
      itemGroups?.map((group, groupIndex) => (
        <Box key={groupIndex}>
          {group.items.map((item, index) => (
            <MenuItem key={index} disabled={item.disabled} hidden={item.hidden} onClick={() => handleMenuItemClick(item)}>
              {item.label}
            </MenuItem>
          ))}
          {groupIndex !== itemGroups.length - 1 && <Divider />}
        </Box>
      ))

    return items ? renderSingleItems() : renderItemGroups()
  }

  return (
    <>
      <IconButton
        onClick={handlePopoverClick}
        size="small"
        aria-label={AriaElementLabel.DropdownIconButton}
        disabled={shouldDisableButton}
      >
        {buttonIcon}
      </IconButton>
      <Menu
        anchorEl={popoverAnchorEl}
        getContentAnchorEl={null}
        open={popoverIsOpen}
        onClose={handlePopoverClose}
        PaperProps={{
          style: { minWidth: `${lastAnchorWidth}px` },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {renderItems()}
      </Menu>
    </>
  )
}

export { Dropdown }
