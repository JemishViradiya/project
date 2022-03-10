/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-restricted-globals */
// dependencies
import React from 'react'

import Box from '@material-ui/core/Box'
// components
import Chip from '@material-ui/core/Chip'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'

// utils
import { boxFlexBetweenProps, boxFlexEndProps, boxPaddingProps, CaretDown, spacedDropdownMenuProps, Times } from '@ues/assets'

import { usePopover } from '../Table/tableHooks'

export const popoverChip = () => {
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const popoverChipLabel = (
    <Box {...boxFlexBetweenProps}>
      <Box>
        <Typography variant="body2">Popover Chip</Typography>
      </Box>
      <CaretDown className="popover-chip-caret-down" />
    </Box>
  )

  return (
    <>
      <Chip label={popoverChipLabel} variant="outlined" onClick={handlePopoverClick} />
      <Popover open={popoverIsOpen} anchorEl={popoverAnchorEl} onClose={handlePopoverClose} {...spacedDropdownMenuProps}>
        <Box {...boxPaddingProps}>
          <Box {...boxFlexEndProps}>
            <Box onClick={handlePopoverClose}>
              <Times />
            </Box>
          </Box>
          <Typography>Your Great Popover Content Here!</Typography>
        </Box>
      </Popover>
    </>
  )
}

export default {
  title: 'Chip',
}
