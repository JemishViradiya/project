import React, { memo } from 'react'

import Menu from '@material-ui/core/Menu'

import { dropdownMenuProps } from '@ues/assets'

import type { DropdownProps } from './types'

const Dropdown = memo(({ trigger, options, popover }: DropdownProps) => {
  const { popoverAnchorEl, handlePopoverClose, popoverIsOpen, lastAnchorWidth } = popover

  return (
    <>
      {trigger}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
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
        {options}
      </Menu>
    </>
  )
})

export default Dropdown
