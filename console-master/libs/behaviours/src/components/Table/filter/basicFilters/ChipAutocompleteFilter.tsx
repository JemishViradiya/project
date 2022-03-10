/* eslint-disable jsx-a11y/no-autofocus */
import { debounce, get, isEmpty } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import type { PopoverProps } from '@material-ui/core/Popover'
import Popover from '@material-ui/core/Popover'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import useAutocomplete from '@material-ui/lab/useAutocomplete'

import { usePrevious } from '@ues-data/shared'
import { BasicCancel, BasicSearch, boxFlexBetweenProps, boxPaddingProps, dropdownMenuProps, ExclamationCircle } from '@ues/assets'

import type { FilterProps, SimpleFilter } from '../../../../filters'
import { usePopover } from '../../../../popovers'
import { AutocompleteHighlightMatch } from './AutocompleteHighlightMatch'
import { FilterChipIcon } from './FilterChipIcon'
import { FilterIcon } from './FilterIcon'

const useStyles = makeStyles(() => ({
  chipRoot: {
    maxWidth: '100%',
  },
  chipLabel: {
    display: 'block',
  },
}))

export interface ChipAutocompleteFilterProps<TFilter extends unknown> {
  label: string
  onIconClick: () => unknown
  onClear: () => void
  popoverProps?: Pick<PopoverProps, 'open' | 'anchorEl' | 'onClose'>
  autocompleteProps: ReturnType<typeof useChipAutocompleteFilter>['autocompleteProps']
  selectedItems: TFilter[]
  onSelectedItemChange: (item: TFilter) => void
  getLabel: (obj: TFilter) => string
  getItemId: (obj: TFilter) => string
  chipIcon?: boolean
  disabled?: boolean
  helperText?: string
  maxSelectedItems?: number
}

export const ChipAutocompleteFilter = <TFilter extends unknown>({
  label,
  onIconClick,
  onClear,
  popoverProps,
  autocompleteProps,
  selectedItems,
  onSelectedItemChange,
  getLabel,
  getItemId,
  disabled,
  chipIcon,
  helperText,
  maxSelectedItems = 15,
}: ChipAutocompleteFilterProps<TFilter>) => {
  const { t } = useTranslation('tables')
  const classes = useStyles()

  const isFilterSelected = selectedItems.length > 0
  const isMaxSelectedItemReached = selectedItems.length >= maxSelectedItems

  const renderMaxSelectionMessage = () =>
    isMaxSelectedItemReached ? (
      <>
        <Typography variant="body2" color="error">
          {t('MaximumItemInFilterSelected', {
            count: maxSelectedItems,
          })}
        </Typography>

        <Box display="flex" alignItems="center" pb={3}>
          <Box display="flex" mr={1}>
            <ExclamationCircle fontSize="small" color="error" />
          </Box>
          <Typography variant="caption" color="error">
            {t('DeselectChoicesToChangeFilter')}
          </Typography>
        </Box>
      </>
    ) : (
      <Box display="flex" alignItems="center" pb={3}>
        <Typography variant="body2" color="textPrimary">
          {t('MaximumItemInFilterSelected', {
            count: maxSelectedItems,
          })}
        </Typography>
      </Box>
    )

  return (
    <>
      {chipIcon ? (
        <FilterChipIcon
          chipLabel={label + (isFilterSelected ? ` +${selectedItems.length}` : '')}
          handleClick={onIconClick}
          handleClear={onClear}
          modified={isFilterSelected}
          open={popoverProps.open}
          disabled={disabled}
        />
      ) : (
        <FilterIcon handleClick={onIconClick} modified={isFilterSelected} disabled={disabled} />
      )}

      <Popover
        {...popoverProps}
        {...dropdownMenuProps}
        PaperProps={{
          className: 'chip-auto-complete-filter',
        }}
      >
        <Box {...boxFlexBetweenProps} {...boxPaddingProps} pt={3}>
          <Typography variant="subtitle1" color="textPrimary">
            {label}
          </Typography>
        </Box>

        <Box display="flex" className="columns-container">
          <Box {...boxPaddingProps} pb={4}>
            <MultiSelectAutocompleteSearch
              {...autocompleteProps}
              isMaxSelectedItemReached={isMaxSelectedItemReached}
              helperText={helperText}
            />
          </Box>

          {isFilterSelected ? (
            <Box display="flex" flexDirection="column" {...boxPaddingProps} overflow={'auto'}>
              {renderMaxSelectionMessage()}
              <Grid container spacing={2}>
                {selectedItems.map(item => (
                  <Grid item key={getItemId(item)} style={{ maxWidth: '100%' }}>
                    <Chip
                      variant="outlined"
                      label={getLabel(item)}
                      onDelete={() => onSelectedItemChange(item)}
                      classes={{
                        root: classes.chipRoot,
                        label: classes.chipLabel,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : null}
        </Box>
      </Popover>
    </>
  )
}

interface UseChipAutocompleteFilterProps<TFilter> {
  filterProps: FilterProps<SimpleFilter<TFilter[]>>
  key: string
  options: TFilter[]
  getOptions: (str: string) => void
  clearOptions: () => void
  debounceInterval?: number
  minCharacters?: number
  maxSelectedItems?: number
  getLabel: (obj: TFilter) => string
  getItemId: (obj: TFilter) => string
}

export const useChipAutocompleteFilter = <TFilter extends unknown>({
  filterProps,
  key,
  options,
  getOptions,
  clearOptions,
  getLabel,
  getItemId,
  debounceInterval = 300,
  minCharacters = 3,
  maxSelectedItems = 15,
}: UseChipAutocompleteFilterProps<TFilter>) => {
  const { activeFilters, onSetFilter, onRemoveFilter } = filterProps
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose: closePopopover, popoverIsOpen } = usePopover()

  const { value = [] } = get(activeFilters, key, {}) as SimpleFilter<TFilter[]>
  const prevValue = usePrevious(value)
  const [selectedItems, setSelectedItems] = useState<TFilter[]>([])

  const onSelectedItemChange = useCallback(
    (item: TFilter) => {
      let modifiedSelectedItems: TFilter[] = []
      const itemIndex = selectedItems.findIndex(selectedItem => getItemId(item) === getItemId(selectedItem))

      if (itemIndex > -1) {
        modifiedSelectedItems = selectedItems.filter(selectedItem => getItemId(item) !== getItemId(selectedItem))
      } else {
        modifiedSelectedItems = [...selectedItems, item]
      }

      modifiedSelectedItems.sort((a, b) => (getLabel(a) > getLabel(b) ? 1 : -1))

      setSelectedItems(modifiedSelectedItems)
      onSetFilter({
        key: key,
        value: { value: modifiedSelectedItems.map(getItemId) as TFilter[] },
      })
    },
    [getItemId, getLabel, key, onSetFilter, selectedItems],
  )

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

  const onClear = useCallback(() => {
    onRemoveFilter(key)
    setSelectedItems([])
  }, [key, onRemoveFilter])

  const handlePopoverClose = useCallback(() => {
    clearOptions()
    closePopopover()
  }, [clearOptions, closePopopover])

  useEffect(() => {
    if (prevValue?.length > 0 && value?.length === 0 && selectedItems.length > 0) {
      setSelectedItems([])
      clearOptions()
    }
  }, [clearOptions, prevValue?.length, selectedItems.length, value?.length])

  return {
    popoverProps: {
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverClose,
    },
    autocompleteProps: {
      options,
      getOptions: handleGetOptions,
      clearOptions,
      onSelectedItemChange,
      getLabel,
      getItemId,
      selectedItems,
      minCharacters,
    },
    selectedItems,
    onSelectedItemChange,
    onIconClick: handlePopoverClick,
    onClear,
    getLabel,
    getItemId,
    maxSelectedItems,
  }
}

interface MultiSelectAutocompleteSearchProps<TFilter> {
  options: TFilter[]
  getOptions: (value: string) => void
  onSelectedItemChange: (item: TFilter) => void
  clearOptions: () => void
  getLabel: (obj: TFilter) => string
  getItemId: (obj: TFilter) => string
  selectedItems: TFilter[]
  minCharacters: number
  helperText: string
  isMaxSelectedItemReached?: boolean
}

const MultiSelectAutocompleteSearch = <TFilter extends unknown>({
  options,
  selectedItems,
  getLabel,
  getItemId,
  getOptions,
  onSelectedItemChange,
  clearOptions,
  helperText,
  minCharacters,
  isMaxSelectedItemReached = false,
}: MultiSelectAutocompleteSearchProps<TFilter>) => {
  const {
    inputValue,
    groupedOptions,
    getRootProps,
    getInputProps,
    getClearProps,
    getListboxProps,
    getOptionProps,
  } = useAutocomplete<TFilter, boolean, boolean, boolean>({
    open: true,
    freeSolo: true,
    disableCloseOnSelect: true,
    getOptionLabel: getLabel,
    options,
    filterOptions: () => options,
    onInputChange: (_event, inputValue, reason) => {
      const trimmedValue = inputValue?.trim()

      if (reason !== 'reset' && trimmedValue?.length >= minCharacters) {
        getOptions(inputValue)
      } else if (clearOptions && options?.length > 0) {
        clearOptions()
      }
    },
  })

  const selectedItemsIds = selectedItems.map(getItemId)

  return (
    <Box {...getRootProps()} onKeyDown={(null as unknown) as undefined} width="100%">
      <TextField
        fullWidth
        autoFocus
        helperText={helperText}
        className="no-label"
        InputProps={{
          ...getInputProps(),
          startAdornment: <BasicSearch />,
          endAdornment: !isEmpty(inputValue) && (
            <IconButton {...getClearProps()}>
              <BasicCancel />
            </IconButton>
          ),
        }}
      />
      {groupedOptions && groupedOptions.length > 0 && (
        <MenuList
          {...getListboxProps()}
          style={{
            maxHeight: 'calc(100% - 72px)',
            overflow: 'auto',
          }}
        >
          {groupedOptions.map((option, index) => {
            const disabled = isMaxSelectedItemReached && !selectedItemsIds.includes(getItemId(option))
            return (
              <MenuItem
                key={index}
                button
                {...getOptionProps({ option, index })}
                onClick={() => onSelectedItemChange(option)}
                aria-disabled={disabled}
                disabled={disabled}
              >
                <ListItemIcon>
                  <Checkbox checked={selectedItemsIds.includes(getItemId(option))} value={index} disabled={disabled} edge="start" />
                </ListItemIcon>
                <ListItemText
                  primary={<AutocompleteHighlightMatch option={option} inputValue={inputValue} getLabel={getLabel} />}
                />
              </MenuItem>
            )
          })}
        </MenuList>
      )}
    </Box>
  )
}
