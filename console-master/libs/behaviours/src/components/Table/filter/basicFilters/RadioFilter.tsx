import { get } from 'lodash-es'
import React from 'react'

import { ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem, Radio, Typography } from '@material-ui/core'

import { dropdownMenuProps } from '@ues/assets'

import type { FilterProps, Labels, SimpleFilter } from '../../../../filters/filters.hooks'
import { usePopover } from '../../../../popovers'
import { FilterIcon } from './FilterIcon'

export interface RadioFilterProps<TValue extends string | number> {
  label: string
  onIconClick: () => unknown
  popoverProps?: any
  items: TValue[]
  onChange: (newValue: TValue, closeAfterSelect?: boolean) => () => void
  selected: TValue
  itemsLabels?: Labels<TValue>
  closeAfterSelect?: boolean
  disabled?: boolean
}

export const RadioFilter = <T extends string | number>({
  items,
  label,
  onIconClick,
  popoverProps,
  onChange,
  selected,
  itemsLabels,
  closeAfterSelect,
  disabled,
}: RadioFilterProps<T>) => {
  return (
    <>
      <FilterIcon handleClick={onIconClick} modified={selected !== null} disabled={disabled} />
      <Menu
        {...popoverProps}
        getContentAnchorEl={null}
        {...dropdownMenuProps}
        PaperProps={{
          className: 'filter-paper',
        }}
      >
        <ListSubheader>
          <Typography variant="subtitle1" color="textPrimary">
            {label}
          </Typography>
        </ListSubheader>
        {items.map(item => (
          <MenuItem key={item} onClick={onChange(item, closeAfterSelect)}>
            <ListItemIcon>
              <Radio checked={selected === item} value={item} edge="start" />
            </ListItemIcon>
            <ListItemText
              primary={itemsLabels ? itemsLabels[item] : item}
              primaryTypographyProps={{
                variant: 'body2',
                color: 'textPrimary',
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export const useRadioFilter = <T extends unknown = string>({
  filterProps,
  key,
}: {
  filterProps: FilterProps<SimpleFilter<T>>
  key: string
}) => {
  const { activeFilters, onSetFilter } = filterProps
  const { value: selected } = get(activeFilters, key, { value: null }) as SimpleFilter<T>

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const onChange = (inputValue: T, closeAfterSelect?: boolean) => () => {
    onSetFilter({
      key,
      value: { value: inputValue },
    })
    if (closeAfterSelect) {
      handlePopoverClose()
    }
  }

  return {
    popoverProps: {
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverClose,
    },
    onIconClick: handlePopoverClick,
    onChange,
    selected,
  }
}
