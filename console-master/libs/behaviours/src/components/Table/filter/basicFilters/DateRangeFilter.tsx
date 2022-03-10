/* eslint-disable jsx-a11y/no-autofocus */

import moment from 'moment'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DateFnsUtils from '@date-io/moment'

import { Box, Button, Popover, Typography, useTheme } from '@material-ui/core'
import { DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import type { UesTheme } from '@ues/assets'
import { BasicCalendar, boxFlexEndProps, boxPaddingProps, dateFormats, dropdownMenuProps, I18nFormats } from '@ues/assets'

import { OPERATOR_VALUES } from '../../../../filters/filters.constants'
import type { CustomFilter, FilterProps } from '../../../../filters/filters.hooks'
import { renderDayOverride } from '../../../../filters/filters.utils'
import { usePopover } from '../../../../popovers'
import type { DateObj } from '../../types'
import { FilterChipIcon } from './FilterChipIcon'
import { FilterIcon } from './FilterIcon'

const validateDateRange = (internalMinDate: DateObj, internalMaxDate: DateObj, rangeMin?: DateObj, rangeMax?: DateObj) => {
  const isDateValuesValid = internalMinDate?.isValid() && internalMaxDate?.isValid()
  const isMinDateAfterMinRange = rangeMin ? internalMinDate.isSameOrAfter(rangeMin.startOf('day')) : true
  const isMaxDateAfterMinDate = internalMaxDate.isSameOrAfter(internalMinDate)
  const isMaxDateBeforeMaxRange = internalMaxDate.isSameOrBefore(rangeMax.endOf('day'))

  return isDateValuesValid && isMinDateAfterMinRange && isMaxDateAfterMinDate && isMaxDateBeforeMaxRange
}

interface DateRangeFilterProps {
  label: string
  onIconClick: () => unknown
  popoverProps?: any
  onSelectDate: (selectedDate: DateObj, value: 'min' | 'max') => void
  minDate: DateObj
  maxDate: DateObj
  rangeMin?: DateObj
  rangeMax?: DateObj
  isRangeValid: boolean
  isModified: boolean
  isFilterSet: boolean
  messages: Record<string, string>
  onClear: () => void
  onApply: () => void
  disabled?: boolean
  chipIcon?: boolean
}

export const DateRangeFilter = ({
  label,
  onIconClick,
  popoverProps,
  onSelectDate,
  minDate,
  maxDate,
  rangeMin,
  rangeMax,
  isRangeValid,
  isModified,
  isFilterSet,
  messages,
  onClear,
  onApply,
  disabled,
  chipIcon,
}: DateRangeFilterProps) => {
  const theme = useTheme<UesTheme>()
  const { t } = useTranslation(['tables', 'formats'])
  const isMinValid = minDate?.isValid()
  const isMaxValid = maxDate?.isValid()

  const fromDateInputMaxDate = rangeMax && maxDate.isAfter(rangeMax) ? rangeMax : maxDate
  const fromDateInputMaxDateMessage =
    rangeMax && maxDate.isAfter(rangeMax) ? messages.DateCannotBeFuture : messages.CannotFallAfterTo
  const toDateInputMinDate = rangeMin && minDate.isBefore(rangeMin) ? rangeMin : minDate
  const toDateInputMinDateMessage =
    rangeMin && minDate.isBefore(rangeMin) ? messages.CannotFallBeforeMinDateRange : messages.CannotFallBeforeFrom

  return (
    <>
      {chipIcon ? (
        <FilterChipIcon
          chipLabel={label}
          handleClick={onIconClick}
          handleClear={onClear}
          modified={isFilterSet}
          open={popoverProps.open}
          disabled={disabled}
        />
      ) : (
        <FilterIcon handleClick={onIconClick} modified={isFilterSet} disabled={disabled} />
      )}

      <Popover
        {...popoverProps}
        {...dropdownMenuProps}
        PaperProps={{
          className: 'date-range-filter',
        }}
      >
        <Box {...boxPaddingProps} paddingTop={3}>
          <Typography variant="subtitle1" color="textPrimary">
            {label}
          </Typography>
        </Box>
        <Box display="flex" {...boxPaddingProps}>
          <Box display="flex" flexDirection="column" marginRight={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                value={minDate}
                onChange={d => onSelectDate(d, 'min')}
                minDate={rangeMin}
                maxDate={fromDateInputMaxDate}
                format={dateFormats.DateShort}
                invalidDateMessage={messages.InvalidDatetime}
                minDateMessage={messages.CannotFallBeforeMinDateRange}
                maxDateMessage={fromDateInputMaxDateMessage}
                fullWidth
                autoFocus
                disableToolbar
                variant="inline"
                open={false}
                label={t('from')}
                placeholder={dateFormats.DateShort}
                keyboardIcon={null}
                InputAdornmentProps={{
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  component: () => <BasicCalendar color="disabled" />,
                }}
                InputProps={{ inputProps: { tabIndex: 1 } }}
              />
              <DatePicker
                value={minDate}
                onChange={d => onSelectDate(d, 'min')}
                minDate={rangeMin}
                maxDate={fromDateInputMaxDate}
                disableToolbar
                variant="static"
                renderDay={renderDayOverride(theme, !isMinValid)}
              />
            </MuiPickersUtilsProvider>
          </Box>
          <Box display="flex" flexDirection="column">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                value={maxDate}
                onChange={d => onSelectDate(d, 'max')}
                minDate={toDateInputMinDate}
                maxDate={rangeMax}
                format={dateFormats.DateShort}
                invalidDateMessage={messages.InvalidDatetime}
                minDateMessage={toDateInputMinDateMessage}
                maxDateMessage={messages.DateCannotBeFuture}
                fullWidth
                disableToolbar
                variant="inline"
                open={false}
                label={t('to')}
                placeholder={dateFormats.DateShort}
                keyboardIcon={null}
                InputAdornmentProps={{
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  component: () => <BasicCalendar color="disabled" />,
                }}
                InputProps={{ inputProps: { tabIndex: 2 } }}
              />
              <DatePicker
                value={maxDate}
                onChange={d => onSelectDate(d, 'max')}
                minDate={toDateInputMinDate}
                maxDate={rangeMax}
                disableToolbar
                variant="static"
                renderDay={renderDayOverride(theme, !isMaxValid)}
              />
            </MuiPickersUtilsProvider>
          </Box>
        </Box>
        <Box {...boxFlexEndProps} {...boxPaddingProps} paddingTop={0}>
          <Button variant="outlined" onClick={onClear} disabled={!isFilterSet}>
            {t('clear')}
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button variant="contained" color="primary" onClick={onApply} disabled={!isRangeValid || (!isModified && isFilterSet)}>
            {t('apply')}
          </Button>
        </Box>
      </Popover>
    </>
  )
}

// eslint-disable-next-line no-redeclare
export type DateRangeFilter = { minDate?: DateObj; maxDate?: DateObj }
export const useDateRangeFilter = ({
  filterProps,
  key,
  rangeMin,
  rangeMax = moment(),
}: {
  filterProps: FilterProps<CustomFilter<DateRangeFilter>>
  key: string
  rangeMin?: DateObj
  rangeMax?: DateObj
}) => {
  const { t, i18n } = useTranslation(['tables', 'formats'])

  const { activeFilters, onSetFilter, onRemoveFilter } = filterProps
  const { minDate, maxDate, isFilterSet } = useMemo(() => {
    const { minDate, maxDate } = (activeFilters?.[key] ?? {}) as DateRangeFilter
    return {
      minDate: minDate ?? moment(),
      maxDate: maxDate ?? moment(),
      isFilterSet: !!(minDate && maxDate),
    }
  }, [activeFilters, key])

  const messages = useMemo(
    () => ({
      InvalidDatetime: t('InvalidDatetime'),
      DateCannotBeFuture: t('DateCannotBeFuture'),
      CannotFallAfterTo: t('CannotFallAfterTo'),
      CannotFallBeforeMinDateRange: t('CannotFallBeforeMinDateRange', {
        minDate: i18n.format(rangeMin, I18nFormats.DateShort),
      }),
      CannotFallBeforeFrom: t('CannotFallBeforeFrom'),
    }),
    [i18n, rangeMin, t],
  )

  const [internalMinDate, setInternalMinDate] = useState(minDate)
  const [internalMaxDate, setInternalMaxDate] = useState(maxDate)

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const resetDates = useCallback(() => {
    setInternalMinDate(moment())
    setInternalMaxDate(moment())
  }, [])

  const handlePopoverCloseWithValidation = useCallback(() => {
    handlePopoverClose()
    if (!internalMinDate.isValid() || !internalMaxDate.isValid()) {
      resetDates()
    }
  }, [handlePopoverClose, internalMaxDate, internalMinDate, resetDates])

  const onSelectDate = useCallback((selectedDate: DateObj, value: 'min' | 'max') => {
    if (!selectedDate) {
      return
    }
    value === 'min' ? setInternalMinDate(selectedDate) : setInternalMaxDate(selectedDate)
  }, [])

  const onClearRange = useCallback(() => {
    resetDates()
    onRemoveFilter(key)
  }, [key, onRemoveFilter, resetDates])

  const onApply = useCallback(() => {
    const newInternalMinDate = moment(internalMinDate).startOf('day')
    const newInternalMaxDate = moment(internalMaxDate).endOf('day')
    setInternalMinDate(newInternalMinDate)
    setInternalMaxDate(newInternalMaxDate)
    onSetFilter({
      key,
      value: {
        minDate: newInternalMinDate,
        maxDate: newInternalMaxDate,
        operator: OPERATOR_VALUES.IS_BETWEEN,
      },
    })
    handlePopoverClose()
  }, [handlePopoverClose, internalMaxDate, internalMinDate, key, onSetFilter])

  const isRangeValid = validateDateRange(internalMinDate, internalMaxDate, rangeMin, rangeMax)

  return {
    popoverProps: {
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverCloseWithValidation,
    },
    onIconClick: handlePopoverClick,
    onClear: onClearRange,
    onSelectDate,
    rangeMin,
    rangeMax,
    isRangeValid,
    minDate: internalMinDate,
    maxDate: internalMaxDate,
    isModified: minDate !== internalMinDate || maxDate !== internalMaxDate,
    isFilterSet,
    onApply,
    messages,
  }
}
