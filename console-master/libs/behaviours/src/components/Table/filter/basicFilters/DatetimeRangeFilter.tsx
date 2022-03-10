/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/tabindex-no-positive */
import { cond, flow } from 'lodash-es'
import type { Moment } from 'moment'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DateFnsUtils from '@date-io/moment'

import { Box, Button, Divider, Popover, Typography, useTheme } from '@material-ui/core'
import { DatePicker, KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import type { UesTheme } from '@ues/assets'
import { boxFlexEndProps, boxPaddingProps, dropdownMenuProps, I18nFormats } from '@ues/assets'

import { OPERATOR_VALUES } from '../../../../filters/filters.constants'
import type { CustomFilter, FilterProps } from '../../../../filters/filters.hooks'
import { renderDayOverride } from '../../../../filters/filters.utils'
import { usePopover } from '../../../../popovers'
import { FilterIcon } from './FilterIcon'
import TimeSelect from './TimeSelect'
import { TimeZonePicker as TimeZonePickerComp, useTimeZonePicker } from './TimeZonePicker'

const getPlaceholder = (isMin, dateFormat) => {
  const datetime = isMin ? moment().subtract(1, 'day') : moment()
  return datetime.format(dateFormat)
}

const KeyboardPicker = ({
  dateFormat,
  label,
  onChange,
  date,
  tabIndex = 1,
  minDate,
  maxDate,
  messages,
  isFuture,
  disableFuture,
}) => {
  const theme = useTheme<UesTheme>()

  return (
    <Box>
      <KeyboardDateTimePicker
        value={date}
        onChange={onChange}
        format={dateFormat}
        fullWidth
        autoFocus
        disableToolbar
        disableFuture={disableFuture}
        strictCompareDates
        variant="inline"
        open={false}
        label={label}
        keyboardIcon={null}
        InputProps={{
          inputProps: { tabIndex },
        }}
        InputLabelProps={{ shrink: true }}
        maxDate={maxDate}
        minDate={minDate}
        invalidDateMessage={messages.InvalidDatetime}
        maxDateMessage={disableFuture && isFuture ? messages.DateCannotBeFuture : messages.CannotFallAfterTo}
        minDateMessage={messages.CannotFallBeforeFrom}
        placeholder={getPlaceholder(true, dateFormat)}
        title={label}
      />
      <DatePicker
        color="secondary"
        value={date}
        onChange={onChange}
        disableToolbar
        disableFuture={disableFuture}
        maxDate={maxDate}
        minDate={minDate}
        variant="static"
        renderDay={renderDayOverride(theme, false)}
      />
    </Box>
  )
}

const TimePicker = ({ format24h, isMin, onCurrentTimeClick, selectChange, datetime }) => {
  return (
    <Box marginTop={2}>
      <TimeSelect format24h={format24h} onCurrentTimeClick={onCurrentTimeClick(isMin)}>
        <TimeSelect.Hour value={datetime.hour} onChange={selectChange.hour(isMin)} format24h={format24h} />
        &nbsp;:&nbsp;
        <TimeSelect.Minute value={datetime.minute} onChange={selectChange.minute(isMin)} />
        &nbsp;&nbsp;&nbsp;
        <TimeSelect.AmPm value={datetime.AmPm} onChange={selectChange.AmPm(isMin)} format24h={format24h} />
      </TimeSelect>
    </Box>
  )
}

interface DatetimeRangeFilterProps {
  label: string
  onIconClick: () => unknown
  popoverProps?: any
  datePickerProps: any
  isModified: boolean
  isFilterSet: boolean
  rangeValid: boolean
  onMaxDatetimeChange: (value) => void
  onMinDatetimeChange: (value) => void
  minDatetime: {
    date: Moment
    hour: string
    minute: string
    AmPm: string
    getMax: () => Moment
  }
  maxDatetime: {
    date: Moment
    hour: string
    minute: string
    AmPm: string
    getMin: () => Moment
  }
  onCurrentTimeClick: (isMin: boolean) => void
  selectTimeChange: {
    hour: (isMin: any) => (event: any) => void
    minute: (isMin: any) => (event: any) => void
    AmPm: (isMin: any) => (event: any) => void
  }
  setTimeZoneOffset: (value: number) => void
  onClear: () => void
  onApply: () => void
  disabled?: boolean
  allowFutureDates?: boolean
  includeTimeZonePicker?: boolean
}

export const DatetimeRangeFilter = ({
  label,
  onIconClick,
  popoverProps,
  datePickerProps,
  isModified,
  isFilterSet,
  rangeValid,
  onMaxDatetimeChange,
  onMinDatetimeChange,
  minDatetime,
  maxDatetime,
  onCurrentTimeClick,
  selectTimeChange,
  setTimeZoneOffset,
  onClear,
  onApply,
  disabled,
  allowFutureDates,
  includeTimeZonePicker,
}: DatetimeRangeFilterProps) => {
  const { t } = useTranslation(['tables', 'formats'])
  const format24h = t('formats:time.24hour')
  const timeZoneProps = useTimeZonePicker(setTimeZoneOffset)

  return (
    <>
      <FilterIcon handleClick={onIconClick} modified={isFilterSet} disabled={disabled} />
      <Popover {...popoverProps} {...dropdownMenuProps}>
        <Box {...boxPaddingProps} paddingTop={3}>
          <Typography variant="subtitle1" color="textPrimary">
            {label}
          </Typography>
        </Box>
        {includeTimeZonePicker && (
          <Box>
            <TimeZonePickerComp {...timeZoneProps} />
          </Box>
        )}
        <Box display="flex" {...boxPaddingProps}>
          <Box display="flex" flexDirection="column" marginRight={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardPicker
                label={t('from')}
                onChange={onMinDatetimeChange}
                date={minDatetime.date}
                maxDate={minDatetime.getMax()}
                disableFuture={!allowFutureDates}
                {...datePickerProps}
              />
              <Divider />
              <TimePicker
                format24h={format24h}
                isMin={true}
                onCurrentTimeClick={onCurrentTimeClick}
                selectChange={selectTimeChange}
                datetime={minDatetime}
              />
            </MuiPickersUtilsProvider>
          </Box>
          <Box display="flex" flexDirection="column">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Box>
                <KeyboardPicker
                  label={t('to')}
                  onChange={onMaxDatetimeChange}
                  date={maxDatetime.date}
                  tabIndex={2}
                  maxDate={allowFutureDates ? undefined : moment().seconds(59)}
                  minDate={maxDatetime.getMin()}
                  disableFuture={!allowFutureDates}
                  {...datePickerProps}
                />
              </Box>
              <Divider />
              <TimePicker
                format24h={format24h}
                isMin={false}
                onCurrentTimeClick={onCurrentTimeClick}
                selectChange={selectTimeChange}
                datetime={maxDatetime}
              />
            </MuiPickersUtilsProvider>
          </Box>
        </Box>
        <Box {...boxFlexEndProps} {...boxPaddingProps} marginTop={1}>
          <Button variant="outlined" onClick={onClear} disabled={!isFilterSet}>
            {t('clear')}
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button variant="contained" color="primary" onClick={onApply} disabled={!rangeValid || (!isModified && isFilterSet)}>
            {t('apply')}
          </Button>
        </Box>
      </Popover>
    </>
  )
}

const timeSetter12HourFormat = (hourSetter, ampmSetter, hour: number) => {
  flow([
    (hour: number) => {
      cond([
        [(hour: number) => hour < 12, () => ampmSetter('AM')],
        [(hour: number) => hour >= 12, () => ampmSetter('PM')],
      ])(hour)

      return hour
    },
    (hour: number) =>
      cond([
        [(hour: number) => hour < 12 && hour !== 0, hour => hourSetter(hour)],
        [(hour: number) => hour > 12, hour => hourSetter(hour - 12)],
        [(hour: number) => hour === 0 || hour === 12, () => hourSetter(12)],
      ])(hour),
  ])(hour)
}

export type DatetimeRangeFilter = { minDatetime?: Moment; maxDatetime?: Moment; is24h?: boolean }

// TODO needs to be reviewed and separated into several hooks
export const useDatetimeRangeFilter = ({
  filterProps,
  key,
  allowFutureDates,
  includeTimeZonePicker = false,
}: {
  filterProps: FilterProps<CustomFilter<DatetimeRangeFilter>>
  key: string
  allowFutureDates?: boolean
  includeTimeZonePicker?: boolean
}) => {
  const { activeFilters, onRemoveFilter, onSetFilter } = filterProps
  const [internalMinDatetime, setInternalMinDatetime] = useState(moment().seconds(0))
  const [internalMaxDatetime, setInternalMaxDatetime] = useState(moment().seconds(0))
  const [isMinFuture, setIsMinFuture] = useState(false)
  const [isMaxFuture, setIsMaxFuture] = useState(false)
  const [timeZoneOffsetMinutes, setTimeZoneOffsetMinutes] = useState(-new Date().getTimezoneOffset())
  const { t } = useTranslation(['tables', 'formats'])
  const dateTimeFormatShort = t('formats:datetime.short')
  const format24h = t('formats:time.24hour')

  const [internalMinDatetimeMinute, setInternalMinDatetimeMinute] = useState('')
  const [internalMinDatetimeAmPm, setInternalMinDatetimeAmPm] = useState('')
  const [internalMinDatetimeHour, setInternalMinDatetimeHour] = useState('')
  const [internalMaxDatetimeMinute, setInternalMaxDatetimeMinute] = useState('')
  const [internalMaxDatetimeAmPm, setInternalMaxDatetimeAmPm] = useState('')
  const [internalMaxDatetimeHour, setInternalMaxDatetimeHour] = useState('')

  const { minDatetime, maxDatetime, isFilterSet } = useMemo(() => {
    const { minDatetime, maxDatetime } = (activeFilters?.[key] ?? {}) as CustomFilter<DatetimeRangeFilter>
    return {
      minDatetime: minDatetime ?? moment(),
      maxDatetime: maxDatetime ?? moment(),
      isFilterSet: !!(minDatetime && maxDatetime),
    }
  }, [activeFilters, key])

  const messages = useMemo(
    () => ({
      InvalidDatetime: t('InvalidDatetime'),
      DateCannotBeFuture: t('DateCannotBeFuture'),
      CannotFallAfterTo: t('CannotFallAfterTo'),
      CannotFallBeforeFrom: t('CannotFallBeforeFrom'),
    }),
    [t],
  )

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const resetDates = useCallback(() => {
    setInternalMinDatetime(moment().seconds(0))
    setInternalMaxDatetime(moment().seconds(0))
  }, [])

  const doTimeFormatConversion = () => {
    if (!format24h) {
      if (internalMinDatetime && internalMinDatetime.isValid()) {
        timeSetter12HourFormat(setInternalMinDatetimeHour, setInternalMinDatetimeAmPm, internalMinDatetime.hour())
      }

      if (internalMaxDatetime && internalMaxDatetime.isValid()) {
        timeSetter12HourFormat(setInternalMaxDatetimeHour, setInternalMaxDatetimeAmPm, internalMaxDatetime.hour())
      }
    }

    if (format24h) {
      if (internalMinDatetime && internalMinDatetime.isValid()) {
        const hour = internalMinDatetime.hour()

        setInternalMinDatetimeHour(hour.toString())
      }

      if (internalMaxDatetime && internalMaxDatetime.isValid()) {
        const hour = internalMaxDatetime.hour()

        setInternalMaxDatetimeHour(hour.toString())
      }
    }
  }

  const internalValueChangeEffectHandler = isMin => () => {
    // synchronize the individual min/max time select dropdown
    // values with the min/max moment datetime object whenever
    // the min/max moment datetime object changes

    const internalValue = isMin ? internalMinDatetime : internalMaxDatetime
    const minuteValueSetter = isMin ? setInternalMinDatetimeMinute : setInternalMaxDatetimeMinute
    const hourValueSetter = isMin ? setInternalMinDatetimeHour : setInternalMaxDatetimeHour
    const ampmValueSetter = isMin ? setInternalMinDatetimeAmPm : setInternalMaxDatetimeAmPm

    if (!internalValue) {
      hourValueSetter('')
      minuteValueSetter('')
      ampmValueSetter('')
      return
    }

    const minute = internalValue.minute()
    const minuteValueValid = !isNaN(minute)
    if (minuteValueValid) {
      minuteValueSetter(minute.toString())
    }

    const hour = internalValue.hour()
    const hourValueValid = !isNaN(hour)

    if (format24h && hourValueValid) {
      hourValueSetter(hour.toString())
      return
    }

    if (hourValueValid) {
      timeSetter12HourFormat(hourValueSetter, ampmValueSetter, hour)
    }
  }

  useEffect(doTimeFormatConversion, [format24h, internalMaxDatetime, internalMinDatetime])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(internalValueChangeEffectHandler(true), [internalMinDatetime])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(internalValueChangeEffectHandler(false), [internalMaxDatetime])

  useEffect(() => {
    if (popoverIsOpen) {
      if (minDatetime) {
        setInternalMinDatetime(minDatetime.seconds(0))
      }
      if (maxDatetime) {
        setInternalMaxDatetime(maxDatetime.seconds(0))
      }
    }
  }, [popoverIsOpen, setInternalMinDatetime, setInternalMaxDatetime, minDatetime, maxDatetime])

  const resetValues = useCallback(() => {
    resetDates()

    setInternalMinDatetimeMinute('')
    setInternalMinDatetimeHour('')
    setInternalMinDatetimeAmPm('')

    setInternalMaxDatetimeMinute('')
    setInternalMaxDatetimeHour('')
    setInternalMaxDatetimeAmPm('')
    onRemoveFilter(key)
  }, [key, onRemoveFilter, resetDates])

  const applyFilter = useCallback(() => {
    onSetFilter({
      key,
      value: {
        minDatetime: internalMinDatetime,
        maxDatetime: internalMaxDatetime.seconds(moment().seconds()),
        operator: OPERATOR_VALUES.IS_BETWEEN,
      },
    })
    handlePopoverClose()
  }, [handlePopoverClose, internalMaxDatetime, internalMinDatetime, key, onSetFilter])

  const futureCheck = (isMin, updatedDatetime) => {
    isMin ? setIsMinFuture(updatedDatetime.isAfter(moment())) : setIsMaxFuture(updatedDatetime.isAfter(moment()))
  }

  const onDatetimeMinuteSelectChange = isMin => event => {
    const value = event.target.value
    const currentDatetime = isMin ? internalMinDatetime : internalMaxDatetime
    const updatedDatetime = currentDatetime ? moment(currentDatetime) : moment()

    updatedDatetime.set('minute', value)
    futureCheck(isMin, updatedDatetime)
    const setter = isMin ? setInternalMinDatetime : setInternalMaxDatetime
    setter(updatedDatetime)
  }

  const onDatetimeHourSelectChange = isMin => event => {
    const value = event.target.value
    const currentDatetime = isMin ? internalMinDatetime : internalMaxDatetime
    const updatedDatetime = currentDatetime ? moment(currentDatetime) : moment()

    const ampmValue = isMin ? internalMinDatetimeAmPm : internalMaxDatetimeAmPm
    const setter = isMin ? setInternalMinDatetime : setInternalMaxDatetime

    if (format24h) {
      updatedDatetime.set('hour', value)
      futureCheck(isMin, updatedDatetime)
      setter(updatedDatetime)
      return
    }

    if (value === 12 && ampmValue === 'PM') {
      // special case when a PM time was set when the
      // "12" selection occurred in the hour dropdown
      updatedDatetime.set('hour', value)
      futureCheck(isMin, updatedDatetime)
      setter(updatedDatetime)
      return
    }

    if (value === 12 && ampmValue === 'AM') {
      // special case when an AM time was set when the
      // "12" selection occurred in the hour dropdown
      updatedDatetime.set('hour', 0)
      futureCheck(isMin, updatedDatetime)
      setter(updatedDatetime)
      return
    }

    const setValue = ampmValue === 'AM' ? value : value + 12
    updatedDatetime.set('hour', setValue)
    futureCheck(isMin, updatedDatetime)
    setter(updatedDatetime)
  }

  const onDatetimeAmPmSelectChange = isMin => event => {
    const value = event.target.value
    const currentSelection = isMin ? internalMinDatetimeAmPm : internalMaxDatetimeAmPm

    if (value === currentSelection) {
      // prevents repeated subtractions of 12 hours
      // if AM is clicked multiple times & vice-versa
      return
    }

    const currentDatetime = isMin ? internalMinDatetime : internalMaxDatetime
    const updatedDatetime = currentDatetime ? moment(currentDatetime) : moment()

    const setter = isMin ? setInternalMinDatetime : setInternalMaxDatetime
    if (value === 'AM') {
      updatedDatetime.set('hour', updatedDatetime.hour() - 12)
      futureCheck(isMin, updatedDatetime)
      setter(updatedDatetime)
      return
    }

    updatedDatetime.set('hour', updatedDatetime.hour() + 12)
    futureCheck(isMin, updatedDatetime)
    setter(updatedDatetime)
  }

  const onCurrentTimeClick = isMin => () => {
    const currentDatetime = moment()
    const currentHour = currentDatetime.hour()
    const currentMinute = currentDatetime.minute()

    const storedDatetime = isMin ? internalMinDatetime : internalMaxDatetime
    const updatedDatetime = storedDatetime ? moment(storedDatetime) : moment()
    updatedDatetime.set('hour', currentHour)
    updatedDatetime.set('minute', currentMinute)
    //Prevents maxDateMessage from showing when onCurrentTimeClick is used within ~500ms of the minute going up
    updatedDatetime.set('seconds', moment().seconds())
    updatedDatetime.subtract(1, 'second')
    updatedDatetime.set('seconds', 0)
    futureCheck(isMin, updatedDatetime)

    const setter = isMin ? setInternalMinDatetime : setInternalMaxDatetime
    setter(updatedDatetime)
  }

  const onMinDatetimeChange = value => {
    if (value) {
      if (!value.isValid()) {
        // let component display error message
        setInternalMinDatetime(value)
      } else if (!value.isSame(internalMinDatetime, 'minutes')) {
        futureCheck(true, value)
        setInternalMinDatetime(value.seconds(0))
      }
    }
  }

  const onMaxDatetimeChange = value => {
    if (value) {
      if (!value.isValid()) {
        // let component display error message
        setInternalMaxDatetime(value)
      } else if (!value.isSame(internalMaxDatetime, 'minutes')) {
        futureCheck(false, value)
        setInternalMaxDatetime(value.seconds(0))
      }
    }
  }

  const onTimeZoneOffsetChange = useEffect(() => {
    setInternalMaxDatetime(internalMaxDatetime.utcOffset(timeZoneOffsetMinutes, true))
    setInternalMinDatetime(internalMinDatetime.utcOffset(timeZoneOffsetMinutes, true))
  }, [internalMaxDatetime, internalMinDatetime, timeZoneOffsetMinutes])

  const checkMaxDateIsFuture = useEffect(() => {
    setIsMaxFuture(internalMaxDatetime.isAfter(moment()))
  }, [internalMaxDatetime, timeZoneOffsetMinutes])

  const checkMinDateIsFuture = useEffect(() => {
    setIsMinFuture(internalMinDatetime.isAfter(moment()))
  }, [internalMinDatetime, timeZoneOffsetMinutes])

  const getMinDatetimeFieldMaxDatetime = () => {
    if (internalMaxDatetime && internalMaxDatetime.isValid()) {
      return internalMaxDatetime
    }

    return moment()
  }

  const getMaxDatetimeFieldMinDatetime = () => {
    if (internalMinDatetime && internalMinDatetime.isValid()) {
      return internalMinDatetime
    }

    return moment('1970-01-01')
  }

  const now = moment()
  const rangeValid =
    internalMaxDatetime &&
    internalMaxDatetime.isValid() &&
    internalMinDatetime &&
    internalMinDatetime.isValid() &&
    internalMinDatetime.isSameOrBefore(internalMaxDatetime) &&
    internalMaxDatetime.isSameOrAfter(internalMinDatetime) &&
    (allowFutureDates || (internalMinDatetime.isSameOrBefore(now) && internalMaxDatetime.isSameOrBefore(now)))

  return {
    popoverProps: {
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverClose,
    },
    onIconClick: handlePopoverClick,
    onClear: resetValues,
    onApply: applyFilter,
    isFilterSet,
    datePickerProps: {
      dateFormat: dateTimeFormatShort,
      isFuture: isMinFuture || isMaxFuture,
      messages,
    },
    isModified: minDatetime !== internalMinDatetime || maxDatetime !== internalMaxDatetime,
    rangeValid,
    onCurrentTimeClick,
    minDatetime: {
      date: internalMinDatetime,
      hour: internalMinDatetimeHour,
      minute: internalMinDatetimeMinute,
      AmPm: internalMinDatetimeAmPm,
      getMax: getMinDatetimeFieldMaxDatetime,
    },
    maxDatetime: {
      date: internalMaxDatetime,
      hour: internalMaxDatetimeHour,
      minute: internalMaxDatetimeMinute,
      AmPm: internalMaxDatetimeAmPm,
      getMin: getMaxDatetimeFieldMinDatetime,
    },
    onMaxDatetimeChange: onMaxDatetimeChange,
    onMinDatetimeChange: onMinDatetimeChange,
    selectTimeChange: {
      hour: onDatetimeHourSelectChange,
      minute: onDatetimeMinuteSelectChange,
      AmPm: onDatetimeAmPmSelectChange,
    },
    setTimeZoneOffset: setTimeZoneOffsetMinutes,
    allowFutureDates,
    includeTimeZonePicker,
  }
}
