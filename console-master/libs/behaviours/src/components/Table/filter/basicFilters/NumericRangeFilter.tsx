import { get } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Link, Popover, Slider, Typography } from '@material-ui/core'

import { boxFlexBetweenProps, boxPaddingProps, dropdownMenuProps, I18nFormats } from '@ues/assets'

import { OPERATOR_VALUES } from '../../../../filters/filters.constants'
import type { FilterProps, SimpleFilter } from '../../../../filters/filters.hooks'
import type { NumericFilterUnits } from '../../../../filters/filters.units'
import { usePopover } from '../../../../popovers'
import { FilterIcon } from './FilterIcon'

interface NumericRangeFilterProps {
  min: number
  max: number
  label: string
  onIconClick: () => unknown
  popoverProps?: any
  valueText: string
  selected: [number, number]
  isModified: boolean
  onClear: () => void
  onChange: (_event: any, inputValue: any) => void
  disabled?: boolean
}

export const NumericRangeFilter = ({
  min,
  max,
  label,
  onIconClick,
  popoverProps,
  valueText,
  selected,
  isModified,
  onClear,
  onChange,
  disabled,
}: NumericRangeFilterProps) => {
  const { t } = useTranslation(['tables'])

  return (
    <>
      <FilterIcon handleClick={onIconClick} modified={isModified} disabled={disabled} />
      <Popover
        {...popoverProps}
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
          {isModified && (
            <Link onClick={onClear}>
              <Typography variant="body2">{t('clear')}</Typography>
            </Link>
          )}
        </Box>
        <Box {...boxPaddingProps} {...boxFlexBetweenProps}>
          <Slider value={selected} onChange={onChange} valueLabelDisplay="auto" color="secondary" min={min} max={max} />
        </Box>
      </Popover>
    </>
  )
}

export const useNumericRangeFilter = ({
  filterProps,
  key,
  min,
  max,
  unit,
}: {
  filterProps: FilterProps<SimpleFilter<[number, number]>>
  key: string
  min: number
  max: number
  unit?: NumericFilterUnits
}) => {
  const { activeFilters, onSetFilter, onRemoveFilter } = filterProps
  const { value: selected } = get(activeFilters, key, { value: [min, max] }) as SimpleFilter<[number, number]>
  const { t, i18n } = useTranslation(['tables'])
  const ALL_DATA_TEXT = t('allData')
  const [valueText, setValueText] = useState(ALL_DATA_TEXT)

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const getSingleValue = useCallback(
    value => {
      const formattedNumber = i18n.format(value, I18nFormats.Number)
      return unit ? t(unit, { value: formattedNumber }) : formattedNumber
    },
    [i18n, t, unit],
  )
  const getFormattedValue = useCallback(
    value =>
      value[0] === min && value[1] === max
        ? ALL_DATA_TEXT
        : t('betweenNumbers', { from: getSingleValue(value[0]), to: getSingleValue(value[1]) }),
    [ALL_DATA_TEXT, getSingleValue, max, min, t],
  )

  const onChange = useCallback(
    (_event, inputValue) => {
      const valueText = getFormattedValue(inputValue)

      setValueText(valueText)
      onSetFilter({
        key,
        value: { value: inputValue, operator: OPERATOR_VALUES.IS_BETWEEN, formatter: getSingleValue },
      })
    },
    [getFormattedValue, getSingleValue, key, onSetFilter],
  )

  useEffect(() => {
    const filterCleared = !activeFilters[key]
    if (filterCleared) {
      setValueText(ALL_DATA_TEXT)
    } else {
      const valueText = getFormattedValue(selected)
      setValueText(valueText)
    }
  }, [setValueText, ALL_DATA_TEXT, activeFilters, key, getFormattedValue, selected])

  const onClear = useCallback(() => {
    setValueText(ALL_DATA_TEXT)
    onRemoveFilter(key)
  }, [ALL_DATA_TEXT, key, onRemoveFilter])

  const popoverProps = useMemo(
    () => ({
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverClose,
    }),
    [handlePopoverClose, popoverAnchorEl, popoverIsOpen],
  )

  return {
    popoverProps,
    onIconClick: handlePopoverClick,
    onClear,
    valueText,
    onChange,
    isModified: activeFilters[key] !== undefined,
    selected,
    min,
    max,
  }
}
