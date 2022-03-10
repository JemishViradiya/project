// dependencies
import get from 'lodash/get'
import React from 'react'

import Badge from '@material-ui/core/Badge'
import Box from '@material-ui/core/Box'
// components
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

import { boxFlexBetweenProps, boxPaddingProps, dropdownMenuProps, Filter } from '@ues/assets'
import { useFilter, usePopover } from '@ues/behaviours'

export const BooleanFilter = ({ activeFilters, onSetFilter, filterKey: key, label }) => {
  const checked = get(activeFilters, key, null)

  // hooks

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  // actions

  const onChange = () =>
    onSetFilter({
      key,
      value: !checked,
    })

  // utils

  const renderFilterIcon = () => (
    <IconButton onClick={handlePopoverClick}>
      {checked !== null ? (
        <Badge color="secondary" variant="dot">
          <Filter />
        </Badge>
      ) : (
        <Filter />
      )}
    </IconButton>
  )

  return (
    <>
      {renderFilterIcon()}
      <Popover
        open={popoverIsOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        {...dropdownMenuProps}
        PaperProps={{
          className: 'filter-paper',
        }}
      >
        <Box {...boxPaddingProps} paddingTop={3}>
          <Typography variant="subtitle1" color="textPrimary">
            {label}
          </Typography>
        </Box>
        <Box onClick={onChange} style={{ cursor: 'pointer' }} {...boxFlexBetweenProps} {...boxPaddingProps} paddingTop={0}>
          <Typography variant="body2" color="textPrimary">
            Option
          </Typography>
          <Switch checked={checked || false} />
        </Box>
      </Popover>
    </>
  )
}

BooleanFilter.decorators = [
  storyFn => {
    const { activeFilters, onSetFilter } = useFilter()
    const args = {
      activeFilters,
      onSetFilter,
      filterKey: 'test',
      label: 'Boolean Filter',
    }

    return storyFn({ args })
  },
]
