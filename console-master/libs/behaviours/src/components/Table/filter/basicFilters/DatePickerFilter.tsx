/* eslint-disable jsx-a11y/no-autofocus */
import type { Moment } from 'moment'
import moment from 'moment'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DateFnsUtils from '@date-io/moment'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import type { UesTheme } from '@ues/assets'
import { BasicCalendar, BasicSettings, boxFlexBetweenProps, boxFlexEndProps, boxPaddingProps, dropdownMenuProps } from '@ues/assets'

import type { OPERATOR_VALUES } from '../../../../filters/filters.constants'
import { DATE_OPERATORS } from '../../../../filters/filters.constants'
import type { FilterProps, SimpleFilter } from '../../../../filters/filters.hooks'
import { getFieldOperatorValueLabel, renderDayOverride } from '../../../../filters/filters.utils'
import { usePopover, usePopoverTracker } from '../../../../popovers'
import { FilterIcon } from './FilterIcon'
import { FilterOperators } from './FilterOperators'

export interface DatePickerFilterProps {
  label: string
  onIconClick: () => unknown
  popoverProps?: any
  popoverTrackerId?: string
  operatorsProps?: any
  operators?: OPERATOR_VALUES[]
  onSelectDate: (selectedDate: any) => void
  date: Moment
  isModified: boolean
  isFilterSet: boolean
  onClear: () => void
  onApply: () => void
  disabled?: boolean
  min?: Moment
  max?: Moment
}

export const DatePickerFilter = ({
  label,
  onIconClick,
  popoverProps,
  popoverTrackerId,
  operatorsProps,
  operators = DATE_OPERATORS,
  onSelectDate,
  date,
  isModified,
  isFilterSet,
  onClear,
  onApply,
  disabled,
  min,
  max,
}: DatePickerFilterProps): JSX.Element => {
  const { t } = useTranslation(['tables'])
  const theme = useTheme() as UesTheme
  const isValid = date?.isValid()

  return (
    <>
      <FilterIcon handleClick={onIconClick} modified={isFilterSet} disabled={disabled} />
      <Popover
        {...popoverProps}
        {...dropdownMenuProps}
        PaperProps={{
          className: 'date-picker-filter',
          id: popoverTrackerId,
        }}
      >
        <Box {...boxPaddingProps} {...boxFlexBetweenProps} paddingTop={3}>
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
        <Box display="flex" flexDirection="column" {...boxPaddingProps}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              value={date.toISOString()}
              onChange={onSelectDate}
              fullWidth
              autoFocus
              disableToolbar
              disableFuture
              variant="inline"
              open={false}
              label={t('enterDate')}
              keyboardIcon={null}
              InputAdornmentProps={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                component: () => <BasicCalendar color="disabled" />,
              }}
              minDate={min}
              maxDate={max}
            />
            <DatePicker
              value={date}
              onChange={onSelectDate}
              disableToolbar
              disableFuture
              variant="static"
              renderDay={renderDayOverride(theme, !isValid)}
              minDate={min}
              maxDate={max}
            />
          </MuiPickersUtilsProvider>
        </Box>
        <Box {...boxFlexEndProps} {...boxPaddingProps} paddingTop={0}>
          <Button variant="outlined" onClick={onClear} disabled={!isFilterSet}>
            {t('clear')}
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button variant="contained" color="primary" onClick={onApply} disabled={!isValid || (!isModified && isFilterSet)}>
            {t('apply')}
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export const useDatePickerFilter = ({
  filterProps,
  key,
  label,
  dateLabelFormat,
  defaultOperator,
  ignoreTime,
}: {
  filterProps: FilterProps<SimpleFilter<Moment>>
  key: string
  label?: string
  dateLabelFormat?: string
  defaultOperator: OPERATOR_VALUES
  ignoreTime?: boolean
}) => {
  const { t: translate } = useTranslation(['tables'])
  const { activeFilters, onSetFilter, onRemoveFilter } = filterProps

  const { date, isFilterSet } = useMemo(() => {
    const { value: date } = (activeFilters?.[key] ?? {}) as SimpleFilter<Moment>
    return {
      date: date ?? moment(),
      isFilterSet: !!date,
    }
  }, [activeFilters, key])

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const paperId = `date-picker-filter-${key}`
  usePopoverTracker({
    anchorEl: popoverAnchorEl,
    paperId,
  })

  const [internalDate, setInternalDate] = useState(date)
  const [showOperators, setShowOperators] = useState(null)
  const [selectedOperator, setSelectedOperator] = useState(defaultOperator)
  const onSelectOperator = op => () => {
    setSelectedOperator(op)

    if (date) {
      onSetFilter({
        key,
        value: {
          value: date,
          ignoreTime,
          operator: op,
          label: getFieldOperatorValueLabel(
            label || key,
            translate(op).toLowerCase(),
            dateLabelFormat ? date.format(dateLabelFormat) : date.toLocaleString(),
          ),
        },
      })
    }
  }
  const onToggleOperators = () => {
    setShowOperators(!showOperators)
  }

  const resetDate = useCallback(() => {
    setInternalDate(moment())
  }, [])

  const onApply = useCallback(() => {
    onSetFilter({
      key,
      value: {
        operator: selectedOperator,
        value: internalDate,
        ignoreTime,
        label: getFieldOperatorValueLabel(
          label || key,
          translate(selectedOperator).toLowerCase(),
          dateLabelFormat ? internalDate.format(dateLabelFormat) : internalDate.toLocaleString(),
        ),
      },
    })
    handlePopoverClose()
  }, [handlePopoverClose, internalDate, key, onSetFilter, selectedOperator, label, translate, dateLabelFormat, ignoreTime])

  const onClear = useCallback(() => {
    resetDate()
    onRemoveFilter(key)
  }, [key, onRemoveFilter, resetDate])

  const handlePopoverCloseWithValidation = useCallback(() => {
    handlePopoverClose()
    !internalDate.isValid() && resetDate()
  }, [handlePopoverClose, internalDate, resetDate])

  return {
    popoverProps: {
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverCloseWithValidation,
    },
    popoverTrackerId: paperId,
    onIconClick: handlePopoverClick,
    operatorsProps: {
      onToggleOperators,
      onSelectOperator,
      selectedOperator,
      showOperators,
    },
    onSelectDate: setInternalDate,
    date: internalDate,
    isModified: date !== internalDate,
    isFilterSet,
    onApply,
    onClear,
  }
}
