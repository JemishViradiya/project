/* eslint-disable jsx-a11y/no-autofocus */
import { debounce, get, isEmpty, isEqual } from 'lodash-es'
import type { ChangeEvent } from 'react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import type { PopoverProps } from '@material-ui/core'
import { Box, IconButton, MenuItem, MenuList, Popover, TextField, Typography } from '@material-ui/core'
import useAutocomplete from '@material-ui/lab/useAutocomplete'

import { BasicCancel, BasicSearch, BasicSettings, boxFlexBetweenProps, boxPaddingProps, dropdownMenuProps } from '@ues/assets'

import type { OPERATOR_VALUES } from '../../../../filters/filters.constants'
import { STRING_OPERATORS } from '../../../../filters/filters.constants'
import type { FilterProps, SimpleFilter } from '../../../../filters/filters.hooks'
import { usePopover } from '../../../../popovers'
import type { FilterOperatorsProps } from '../../types'
import { AutocompleteHighlightMatch } from './AutocompleteHighlightMatch'
import { FilterIcon } from './FilterIcon'
import { FilterOperators } from './FilterOperators'

export interface AutocompleteSearchFilterProps<TFilter extends unknown> {
  label: string
  onIconClick: () => unknown
  popoverProps?: Pick<PopoverProps, 'open' | 'anchorEl' | 'onClose'>
  operatorsProps?: FilterOperatorsProps
  operators?: OPERATOR_VALUES[]
  autocompleteProps: Partial<ReturnType<typeof useAutocomplete>>
  value: TFilter
  getLabel?: (obj: TFilter) => string
  disabled?: boolean
  helperText?: string
}

export const AutocompleteSearchFilter = <TFilter extends unknown>({
  label,
  onIconClick,
  popoverProps,
  operatorsProps,
  operators = STRING_OPERATORS,
  autocompleteProps,
  value,
  getLabel,
  disabled,
  helperText,
}: AutocompleteSearchFilterProps<TFilter>) => {
  const {
    inputValue,
    groupedOptions,
    getRootProps,
    getInputProps,
    getClearProps,
    getListboxProps,
    getOptionProps,
  } = autocompleteProps

  return (
    <>
      <FilterIcon handleClick={onIconClick} modified={!!value} disabled={disabled} />
      <Popover
        {...popoverProps}
        {...dropdownMenuProps}
        PaperProps={{
          className: 'quick-search-filter',
        }}
      >
        <Box {...boxFlexBetweenProps} {...boxPaddingProps} pt={3}>
          <Typography variant="subtitle1" color="textPrimary">
            {label}
          </Typography>
          {operators && operators.length > 0 && (
            <IconButton onClick={operatorsProps.onToggleOperators} size="small">
              <BasicSettings />
            </IconButton>
          )}
        </Box>
        {operators && <FilterOperators operatorsList={operators} {...operatorsProps} />}
        <Box {...boxPaddingProps} pb={4} {...getRootProps()}>
          <TextField
            fullWidth
            autoFocus
            className="no-label"
            helperText={helperText}
            InputProps={{
              ...getInputProps(),
              startAdornment: <BasicSearch />,
              endAdornment: !isEmpty(value) && (
                <IconButton {...getClearProps()}>
                  <BasicCancel />
                </IconButton>
              ),
            }}
          />
          {groupedOptions && groupedOptions.length > 0 && (
            <MenuList {...getListboxProps()}>
              {groupedOptions.map((option, index) => (
                <MenuItem key={index} button {...getOptionProps({ option, index })}>
                  <AutocompleteHighlightMatch option={option} inputValue={inputValue} getLabel={getLabel} />
                </MenuItem>
              ))}
            </MenuList>
          )}
        </Box>
      </Popover>
    </>
  )
}

interface UseAutocompleteSearchFilterProps<TFilter> {
  filterProps: FilterProps<SimpleFilter<TFilter>>
  key: string
  options: TFilter[]
  getOptions: (str: string) => void
  clearOptions: () => void
  defaultOperator: OPERATOR_VALUES
  allowFreeInput?: boolean
  debounceInterval?: number
  minCharacters?: number
  getLabel?: (obj: TFilter) => string
}
// Client filter by Autocomplete field is not yet implemented(only server side filtering)
export const useAutocompleteSearchFilter = <TFilter extends unknown>({
  filterProps,
  key,
  defaultOperator,
  options,
  getOptions,
  clearOptions,
  getLabel,
  allowFreeInput = true,
  debounceInterval = 300,
  minCharacters = 0,
}: UseAutocompleteSearchFilterProps<TFilter>) => {
  const { activeFilters, onSetFilter, onRemoveFilter } = filterProps
  const [selectedOperator, setSelectedOperator] = useState(defaultOperator)

  const [value, setValue] = useState(() => get(activeFilters, key, {}) as SimpleFilter<TFilter>)

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose: closePopopover, popoverIsOpen } = usePopover()

  const [showOperators, setShowOperators] = useState(false)
  const onSelectOperator = (op: OPERATOR_VALUES) => () => {
    setSelectedOperator(op)

    if (value.value) {
      onSetFilter({
        key,
        value: {
          operator: op,
          value: value.value,
          label: getLabel ? getLabel(value.value) : undefined,
        },
      })
    }
  }
  const onToggleOperators = () => setShowOperators(!showOperators)

  const debouncedGetOptions = useMemo(
    () =>
      debounce(value => {
        getOptions(value)
      }, debounceInterval),
    [debounceInterval, getOptions],
  )

  const handleGetOptions = useCallback(
    (value: string) => {
      debouncedGetOptions.cancel()
      debouncedGetOptions(value)
    },
    [debouncedGetOptions],
  )

  const handleClearSearchText = useCallback(
    event => {
      event.preventDefault()
      setValue({ value: null })
      onRemoveFilter(key)
    },
    [key, onRemoveFilter],
  )

  const handlePopoverClose = useCallback(() => {
    clearOptions()
    closePopopover()
  }, [clearOptions, closePopopover])

  const onSubmit = useCallback(
    (selected: TFilter) => {
      const valueInvalid = !selected || (typeof selected === 'string' && selected.trim().length <= minCharacters)

      if (valueInvalid) {
        onRemoveFilter(key)
      } else {
        onSetFilter({
          key,
          value: {
            operator: selectedOperator,
            value: selected,
            label: getLabel && selected ? getLabel(selected) : undefined,
          },
        })
      }

      if (selected !== null) {
        handlePopoverClose()
      }
    },
    [selectedOperator, key, minCharacters, onRemoveFilter, onSetFilter, handlePopoverClose, getLabel],
  )

  useEffect(() => {
    const newValue = get(activeFilters, key, {}) as SimpleFilter<TFilter>
    if (!isEqual(newValue, value)) {
      setValue(newValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, key])

  const autocompleteProps = useAutocomplete<TFilter, boolean, boolean, boolean>({
    freeSolo: allowFreeInput,
    filterOptions: () => options,
    value: value?.value ?? '',
    getOptionSelected: (option: TFilter, value: TFilter) => isEqual(option, value),
    getOptionLabel: getLabel,
    options,
    onChange: (_event: ChangeEvent<unknown>, value: TFilter) => onSubmit(value),
    onInputChange: (_event, inputValue, reason) => {
      const trimmedValue = inputValue?.trim()

      if (reason === 'input' && trimmedValue?.length >= minCharacters) {
        handleGetOptions(inputValue)
      }

      if (reason === 'clear') {
        handleClearSearchText(_event)
        clearOptions()
      }
    },
  })

  return {
    popoverProps: {
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverClose,
    },
    onIconClick: handlePopoverClick,
    operatorsProps: {
      onToggleOperators,
      onSelectOperator,
      selectedOperator,
      showOperators,
    },
    value: value.value,
    autocompleteProps,
    getLabel,
  }
}
