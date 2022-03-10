import { get } from 'lodash-es'
import React from 'react'

import { Box, Popover, Switch, Typography } from '@material-ui/core'

import { boxFlexBetweenProps, boxPaddingProps, dropdownMenuProps } from '@ues/assets'

import type { FilterProps, SimpleFilter } from '../../../../filters/filters.hooks'
import { usePopover } from '../../../../popovers'
import { FilterIcon } from './FilterIcon'

interface BooleanFilterProps {
  label: string
  optionLabel: string
  onIconClick: () => unknown
  popoverProps?: any
  onChange: () => void
  checked: boolean
  disabled?: boolean
}

export const BooleanFilter = ({
  label,
  optionLabel,
  onIconClick,
  popoverProps,
  onChange,
  checked,
  disabled,
}: BooleanFilterProps) => {
  return (
    <>
      <FilterIcon handleClick={onIconClick} modified={checked !== null} disabled={disabled} />
      <Popover
        {...popoverProps}
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
            {optionLabel}
          </Typography>
          <Switch checked={checked || false} />
        </Box>
      </Popover>
    </>
  )
}

export const useBooleanFilter = ({ filterProps, key }: { filterProps: FilterProps<SimpleFilter<boolean>>; key: string }) => {
  const { activeFilters, onSetFilter } = filterProps
  const { value: checked } = get(activeFilters, key, { value: null }) as SimpleFilter<boolean>

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const onChange = () =>
    onSetFilter({
      key,
      value: { value: !checked },
    })

  return {
    popoverProps: {
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverClose,
    },
    onIconClick: handlePopoverClick,
    onChange,
    checked,
  }
}
