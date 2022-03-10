import { get } from 'lodash-es'
import React from 'react'

import { Checkbox, ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem, Typography } from '@material-ui/core'

import { dropdownMenuProps } from '@ues/assets'

import { OPERATOR_VALUES } from '../../../../filters/filters.constants'
import type { FilterProps, Labels, SimpleFilter } from '../../../../filters/filters.hooks'
import { usePopover } from '../../../../popovers'
import type { FilterOptions } from '../../types'
import { getCheckboxItemsAndLabelsFromOptions } from '../../utils'
import { FilterChipIcon } from './FilterChipIcon'
import { FilterIcon } from './FilterIcon'

export interface CheckboxFilterProps<TValue extends string | number> {
  label: string
  onIconClick: () => unknown
  popoverProps?: any
  items: TValue[] | FilterOptions[]
  onChange: (newValue: TValue) => () => void
  onClear?: () => void
  selected: TValue[]
  itemsLabels?: Labels<TValue>
  disabled?: boolean
  chipIcon?: boolean
}

export const CheckboxFilter = <T extends string | number>({
  items,
  label,
  onIconClick,
  popoverProps,
  onChange,
  onClear,
  selected,
  itemsLabels,
  disabled,
  chipIcon,
}: CheckboxFilterProps<T>) => {
  const isModified = !!selected.length

  if (typeof items[0] === 'object') {
    const values = getCheckboxItemsAndLabelsFromOptions(items as FilterOptions[])
    items = values.items as T[]
    itemsLabels = values.labels as Labels<T>
  }

  return (
    <>
      {chipIcon ? (
        <FilterChipIcon
          chipLabel={label + (isModified ? ` +${selected.length}` : '')}
          handleClick={onIconClick}
          handleClear={onClear}
          modified={isModified}
          open={popoverProps.open}
          disabled={disabled}
        />
      ) : (
        <FilterIcon handleClick={onIconClick} modified={isModified} disabled={disabled} />
      )}

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
          <MenuItem key={item} onClick={onChange(item)}>
            <ListItemIcon>
              <Checkbox
                checked={selected.includes(item)}
                value={item}
                edge="start"
                inputProps={{ 'aria-labelledby': `${item}_label` }}
              />
            </ListItemIcon>
            <ListItemText
              id={`${item}_label`}
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

export const useCheckboxFilter = ({ filterProps, key }: { filterProps: FilterProps<SimpleFilter<any[]>>; key: string }) => {
  const { activeFilters, onSetFilter, onRemoveFilter } = filterProps
  const { value: selected } = get(activeFilters, key, { value: [] }) as SimpleFilter<any[]>

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const onChange = inputValue => () => {
    let { value: vals } = get(activeFilters, key, { value: [] }) as { value: any[] }
    const valIdx = vals.indexOf(inputValue)

    if (valIdx >= 0) {
      vals = vals.filter((_, i) => i !== valIdx)
    } else {
      vals = [...vals, inputValue]
    }

    if (vals.length > 0) {
      onSetFilter({
        key,
        value: { value: vals, operator: OPERATOR_VALUES.IS_IN },
      })
    } else {
      onRemoveFilter(key)
    }
  }

  const onClear = () => onRemoveFilter(key)

  return {
    popoverProps: {
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverClose,
    },
    onIconClick: handlePopoverClick,
    onChange,
    onClear,
    selected,
  }
}
