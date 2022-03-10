import { get } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'

import { Box, IconButton, Popover, TextField, Typography } from '@material-ui/core'

import { BasicCancel, BasicSettings, boxFlexBetweenProps, boxPaddingProps, dropdownMenuProps } from '@ues/assets'

import type { FilterProps, OPERATOR_VALUES, SimpleFilter } from '../../../../filters'
import { usePopover } from '../../../../popovers'
import { FilterIcon } from './FilterIcon'
import { FilterOperators } from './FilterOperators'

const numberRegex = /^[-]?[0-9]+$/i
const positiveNumberRegex = /^[0-9]+$/i
export interface NumericNoRangeFilterProps {
  label: string
  onIconClick: () => unknown
  popoverProps?: any
  operatorsProps?: any
  operators?: OPERATOR_VALUES[]
  value: string
  onTextChange: (event: any) => void
  onClear: (event: any) => void
  handleKeyPress?: (event: any) => void
  disabled?: boolean
}

export const NumericNoRangeFilter = ({
  label,
  onIconClick,
  popoverProps,
  operatorsProps,
  operators,
  value,
  onTextChange,
  onClear,
  handleKeyPress,
  disabled,
}: NumericNoRangeFilterProps) => {
  return (
    <>
      <FilterIcon handleClick={onIconClick} modified={value !== null} disabled={disabled} />
      <Popover
        {...popoverProps}
        {...dropdownMenuProps}
        PaperProps={{
          className: 'filter-paper',
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

        <Box p={4}>
          <TextField
            value={value === null ? '' : value}
            onChange={onTextChange}
            onKeyPress={handleKeyPress}
            color="secondary"
            fullWidth
            className="no-label"
            InputProps={{
              endAdornment: value !== null && (
                <IconButton onClick={onClear} edge="end" size="small">
                  <BasicCancel />
                </IconButton>
              ),
            }}
          />
        </Box>
      </Popover>
    </>
  )
}

export const useNumericNoRangeFilter = ({
  filterProps,
  key,
  defaultOperator,
  onlyPositive = false,
}: {
  filterProps: FilterProps<SimpleFilter<number>>
  key: string
  defaultOperator: OPERATOR_VALUES
  onlyPositive?: boolean
}) => {
  const { activeFilters, onSetFilter, onRemoveFilter } = filterProps
  const [selectedOperator, setSelectedOperator] = useState(defaultOperator)
  const [showOperators, setShowOperators] = useState(false)
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const [textValue, setTextValue] = useState(null)

  useEffect(() => {
    const { value = null } = get(activeFilters, key, {}) as SimpleFilter<number>

    if (value === undefined || value === null) {
      setTextValue(null)
    }
  }, [activeFilters, key])

  const getValidNumber = useCallback(
    value => {
      if (!value || !value.match(onlyPositive ? positiveNumberRegex : numberRegex)) return undefined
      return parseInt(value || 0)
    },
    [onlyPositive],
  )

  const onTextChange = event => {
    const { value } = get(event, 'currentTarget', {})
    if (!value && value !== 0) {
      setTextValue('')
      onRemoveFilter(key)
    } else if (!onlyPositive && value === '-') {
      setTextValue(value)
    } else {
      const number = getValidNumber(value)

      if (number || number === 0) {
        setTextValue(number)
        onSetFilter({
          key,
          value: {
            value: number,
            operator: selectedOperator,
          },
        })
      }
    }
  }

  const onSelectOperator = op => () => {
    setSelectedOperator(op)

    if (textValue || textValue === 0) {
      onSetFilter({
        key,
        value: {
          value: textValue,
          operator: op,
        },
      })
    }
  }

  const onToggleOperators = () => {
    setShowOperators(!showOperators)
  }

  const onClear = event => {
    event.preventDefault()
    setTextValue('')
    onRemoveFilter(key)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handlePopoverClose()
    }
  }

  return {
    popoverProps: {
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverClose,
    },
    operatorsProps: {
      onToggleOperators,
      onSelectOperator,
      selectedOperator,
      showOperators,
    },
    onIconClick: handlePopoverClick,
    onTextChange,
    value: textValue,
    onClear,
    handleKeyPress,
  }
}
