/* eslint-disable jsx-a11y/no-autofocus */
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { BasicCancel, BasicSearch, BasicSettings, boxFlexBetweenProps, boxPaddingProps, dropdownMenuProps } from '@ues/assets'

import type { OPERATOR_VALUES } from '../../../../filters/filters.constants'
import { STRING_OPERATORS } from '../../../../filters/filters.constants'
import type { FilterProps, SimpleFilter } from '../../../../filters/filters.hooks'
import { getFieldOperatorValueLabel } from '../../../../filters/filters.utils'
import { usePopover, usePopoverTracker } from '../../../../popovers'
import { FilterIcon } from './FilterIcon'
import { FilterOperators } from './FilterOperators'

const MINIMUM_FILTER_LENGTH = 3

export interface QuickSearchFilterProps {
  label: string
  onIconClick: (event: any) => void
  popoverProps?: any
  popoverTrackerId?: string
  operatorsProps?: any
  operators?: OPERATOR_VALUES[]
  requireMinimumCharacters?: boolean
  value: string
  setValue: (s: string) => void
  filterValue?: string
  handleKeyPress?: (event: any) => void
  onClear: (event: any) => void
  disabled?: boolean
}

export const QuickSearchFilter = ({
  label,
  onIconClick,
  popoverProps,
  popoverTrackerId,
  operatorsProps,
  operators = STRING_OPERATORS,
  requireMinimumCharacters = false,
  value,
  setValue,
  filterValue = value,
  handleKeyPress,
  onClear,
  disabled,
}: QuickSearchFilterProps) => {
  const { t } = useTranslation('components')
  return (
    <>
      <FilterIcon
        handleClick={onIconClick}
        modified={!!filterValue && (!requireMinimumCharacters || filterValue.length >= MINIMUM_FILTER_LENGTH)}
        disabled={disabled}
      />
      <Popover
        {...popoverProps}
        {...dropdownMenuProps}
        PaperProps={{
          className: 'quick-search-filter',
          id: popoverTrackerId,
        }}
      >
        <Box {...boxFlexBetweenProps} {...boxPaddingProps} pt={3}>
          <Typography variant="subtitle1" color="textPrimary">
            {label}
          </Typography>
          {operators && operators.length > 0 && (
            <IconButton onClick={operatorsProps.onToggleOperators} size="small" title={t('quickSearchFilter.settings')}>
              <BasicSettings />
            </IconButton>
          )}
        </Box>
        {operators && <FilterOperators operatorsList={operators} {...operatorsProps} />}
        <Box {...boxPaddingProps} pb={4}>
          <TextField
            fullWidth
            autoFocus
            className="no-label"
            value={value}
            InputProps={{
              startAdornment: <BasicSearch />,
              endAdornment: !isEmpty(value) && (
                <IconButton onMouseDown={onClear}>
                  <BasicCancel />
                </IconButton>
              ),
            }}
            onChange={event => setValue(event?.target?.value)}
            onKeyPress={handleKeyPress}
          />
          {requireMinimumCharacters && t('quickSearchFilter.minimumCharactersRequired')}
        </Box>
      </Popover>
    </>
  )
}

export const useQuickSearchFilter = ({
  filterProps,
  key,
  label,
  defaultOperator,
  debounceInterval = 300,
  requireMinimumCharacters = false,
}: {
  filterProps: FilterProps<SimpleFilter<string>>
  key: string
  label?: string
  defaultOperator: OPERATOR_VALUES
  debounceInterval?: number
  requireMinimumCharacters?: boolean
}) => {
  const { t: translate } = useTranslation(['tables'])
  const { activeFilters, onSetFilter, onRemoveFilter } = filterProps
  const [selectedOperator, setSelectedOperator] = useState(defaultOperator)

  const [filterValue, setFilterValue] = useState(() => get(activeFilters, `${key}.value`, '') as string)
  const [textValue, setTextValue] = useState(filterValue)

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const paperId = `quick-search-filter-${key}`
  usePopoverTracker({
    anchorEl: popoverAnchorEl,
    paperId,
  })

  const handlePopoverClickInternal = useCallback(
    event => {
      handlePopoverClick(event)
      setTextValue(filterValue)
    },
    [filterValue, handlePopoverClick],
  )

  const [showOperators, setShowOperators] = useState(false)
  const onSelectOperator = (op: OPERATOR_VALUES) => () => {
    setSelectedOperator(op)

    if (filterValue && (!requireMinimumCharacters || filterValue.length >= MINIMUM_FILTER_LENGTH)) {
      onSetFilter({
        key,
        value: {
          operator: op,
          value: filterValue,
          label: getFieldOperatorValueLabel(label || key, translate(op).toLowerCase(), filterValue),
        },
      })
    }
  }
  const onToggleOperators = () => setShowOperators(!showOperators)

  const handleClearSearchText = useCallback(
    event => {
      event.preventDefault()
      setTextValue('')
      setFilterValue('')
      onRemoveFilter(key)
    },
    [setTextValue, onRemoveFilter, key],
  )

  const handleValueChange = useMemo(
    () =>
      debounce(value => {
        const inputInvalid = !value || value.trim() === ''
        if (inputInvalid) {
          onRemoveFilter(key)
          setFilterValue('')
        } else if (requireMinimumCharacters && value.trim().length < MINIMUM_FILTER_LENGTH) {
          // do nothing
        } else {
          setFilterValue(value)
          onSetFilter({
            key,
            value: {
              operator: selectedOperator,
              value,
              label: getFieldOperatorValueLabel(label || key, translate(selectedOperator).toLowerCase(), value),
            },
          })
        }
      }, debounceInterval),
    [debounceInterval, key, requireMinimumCharacters, onRemoveFilter, onSetFilter, selectedOperator, label, translate],
  )

  const handleFeedback = useMemo(
    () =>
      debounce(value => {
        setFilterValue(value)
        setTextValue(value)
      }, 300),
    [],
  )

  const onTextChange = useCallback(
    value => {
      handleFeedback.cancel()
      handleValueChange.cancel()
      setTextValue(value)
      handleValueChange(value)
    },
    [handleFeedback, handleValueChange],
  )

  const newValue = useMemo(() => get(activeFilters, `${key}.value`, '') as string, [key, activeFilters])

  const handleKeyPress = e => {
    if (e.key === 'Enter' && (textValue.length === 0 || !requireMinimumCharacters || textValue.length >= MINIMUM_FILTER_LENGTH)) {
      handlePopoverClose()
    }
  }

  useEffect(() => {
    handleFeedback.cancel()
    if (newValue !== textValue) {
      handleFeedback(newValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newValue])

  return {
    popoverProps: {
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverClose,
    },
    popoverTrackerId: paperId,
    onIconClick: handlePopoverClickInternal,
    operatorsProps: {
      onToggleOperators,
      onSelectOperator,
      selectedOperator,
      showOperators,
    },
    onClear: handleClearSearchText,
    value: textValue,
    setValue: onTextChange,
    filterValue: filterValue,
    handleKeyPress,
  }
}
