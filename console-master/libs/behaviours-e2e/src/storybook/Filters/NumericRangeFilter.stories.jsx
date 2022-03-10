// dependencies
import get from 'lodash/get'
import React, { useState } from 'react'

import Badge from '@material-ui/core/Badge'
import Box from '@material-ui/core/Box'
// components
import IconButton from '@material-ui/core/IconButton'
import Link from '@material-ui/core/Link'
import Popover from '@material-ui/core/Popover'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'

import { BasicFilter, boxFlexBetweenProps, boxFlexCenterProps, boxPaddingProps, dropdownMenuProps } from '@ues/assets'
import { useFilter, usePopover } from '@ues/behaviours'

// constants
const ALL_DATA_TEXT = 'All Data'

export const NumericRangeFilter = ({ min, max, activeFilters, onSetFilter, filterKey: key, label }) => {
  const selected = get(activeFilters, key, [min, max])

  // state
  const [valueText, setValueText] = useState(ALL_DATA_TEXT)

  // hooks

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  // actions

  const onChange = (_event, value) => {
    const valueText = getFormattedValue(value)

    setValueText(valueText)
    onSetFilter({
      key,
      value,
    })
  }

  const onClear = () => {
    setValueText(ALL_DATA_TEXT)
    onSetFilter({
      key,
      value: [min, max],
    })
  }

  // utils

  const getFormattedValue = value => (value[0] === min && value[1] === max ? ALL_DATA_TEXT : `${value[0]} - ${value[1]}`)

  const renderClearButton = () =>
    valueText !== ALL_DATA_TEXT ? (
      <Link onClick={onClear}>
        <Typography variant="body2">Clear</Typography>
      </Link>
    ) : null

  const renderFilterIcon = () => (
    <IconButton onClick={handlePopoverClick}>
      {valueText !== ALL_DATA_TEXT ? (
        <Badge color="secondary" variant="dot">
          <BasicFilter />
        </Badge>
      ) : (
        <BasicFilter />
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
          className: 'numeric-filter',
        }}
      >
        <Box {...boxPaddingProps} paddingTop={3}>
          <Typography variant="subtitle1" color="textPrimary">
            {label}
          </Typography>
        </Box>
        <Box {...boxPaddingProps} {...boxFlexBetweenProps}>
          <Typography variant="body2" color="textPrimary">
            {valueText}
          </Typography>
          {renderClearButton()}
        </Box>
        <Box {...boxPaddingProps} {...boxFlexCenterProps}>
          <Slider value={selected} onChange={onChange} valueLabelDisplay="auto" color="secondary" min={min} max={max} />
        </Box>
      </Popover>
    </>
  )
}

NumericRangeFilter.decorators = [
  storyFn => {
    const { activeFilters, onSetFilter } = useFilter()
    const args = {
      activeFilters,
      onSetFilter,
      filterKey: 'test',
      label: 'Numeric Range Filter',
      min: 0,
      max: 100,
    }

    return storyFn({ args })
  },
]
