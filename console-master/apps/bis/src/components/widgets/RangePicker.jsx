import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

import moment from 'moment'
import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { DayPickerRangeController } from 'react-dates'
import { useTranslation } from 'react-i18next'

import { MenuItem } from '@material-ui/core'

import { Select } from '@ues-bis/shared'
import { ArrowChevronRight } from '@ues/assets'

import { Context as StateContext } from '../../providers/StateProvider'
import { Icon } from '../icons/Icon'
import { getCustomPeriod, getReducedDate, getTimeRange, isRetentionPeriodCustom, Periods } from '../util/DateHelper.js'
import styles from './RangePicker.module.less'

const OptionsScope = [{ ...Periods.LAST_MONTH }, { ...Periods.LAST_WEEK }, { ...Periods.LAST_DAY }, { ...Periods.LAST_HOUR }]

// Block all days in the future
const isDayBlocked = day => day.isAfter(moment(), 'day')

const navNext = (
  <div className={styles.nextMonth}>
    <Icon icon={ArrowChevronRight} />
  </div>
)
const navPrev = (
  <div className={styles.prevMonth}>
    <Icon icon={ArrowChevronRight} className={styles.flipHorizontal} />
  </div>
)

const dropdownOptionFactory = ({ key, value, daysNumber }, t) => {
  return (
    <MenuItem key={daysNumber || value} value={key}>
      {t(value, { count: daysNumber })}
    </MenuItem>
  )
}

export const RangePicker = memo(({ onChange, dataRetentionPeriod }) => {
  const { t } = useTranslation()
  const { currentTimePeriod: context } = useContext(StateContext)
  const [state, setState] = useState({
    // Temporary storage to store startDate before endDate is set.
    startDate: null,
    focusedInput: 'startDate',
    showDatePicker: false,
  })

  const updateState = useCallback(
    obj =>
      setState(prevState => ({
        ...prevState,
        ...obj,
      })),
    [],
  )

  const onDatesChange = useCallback(
    ({ startDate, endDate }) => {
      if (state.focusedInput === 'startDate' || !endDate) {
        // Don't send any events until we have both start and end,
        // just store it in state for now.
        updateState({ startDate })
      } else {
        // Always make sure the endDate is the end of the day
        startDate = moment(startDate).startOf('day')
        endDate = moment(endDate).endOf('day')
        onChange({ start: startDate.unix().toString(), end: endDate.unix().toString() })
      }
    },
    [onChange, state.focusedInput, updateState],
  )

  const onFocusChange = useCallback(
    focusedInput => {
      // Handle switches between selecting startDate and endDate
      updateState({ focusedInput: focusedInput || 'startDate' })
    },
    [updateState],
  )

  const onSelect = useCallback(
    ev => {
      const { value } = ev.target
      if (value === Periods.CUSTOM.key) {
        return updateState({ showDatePicker: true })
      } else if (value === Periods.LAST_CUSTOM_DAYS.key) {
        return onChange({ last: Periods.LAST_CUSTOM_DAYS.key, daysNumber: dataRetentionPeriod })
      }
      // Handle dropdown event
      onChange({ last: value })
    },
    [dataRetentionPeriod, onChange, updateState],
  )

  const isOutsideRange = useCallback(
    day => {
      return dataRetentionPeriod && day.isBefore(getReducedDate(dataRetentionPeriod), 'day')
    },
    [dataRetentionPeriod],
  )

  const renderPicker = useMemo(() => {
    let startDate = state.startDate
    if (!startDate && context.start && context.end) {
      startDate = moment.unix(context.start)
    }

    const endDate = state.focusedInput !== 'endDate' && context.end ? moment.unix(context.end) : null
    return (
      <div>
        <DayPickerRangeController
          isOutsideRange={isOutsideRange}
          startDate={startDate}
          endDate={endDate}
          onDatesChange={onDatesChange}
          focusedInput={state.focusedInput}
          onFocusChange={onFocusChange}
          minimumNights={0}
          hideKeyboardShortcutsPanel
          daySize={24}
          enableOutsideDays
          isDayBlocked={isDayBlocked}
          navNext={navNext}
          navPrev={navPrev}
        />
      </div>
    )
  }, [context.end, context.start, isOutsideRange, onDatesChange, onFocusChange, state.focusedInput, state.startDate])

  const getDropdownOptions = useCallback(
    dataRetentionPeriod => {
      let optionsToRender = []

      if (isRetentionPeriodCustom(dataRetentionPeriod)) {
        const { key, value, daysNumber } = getCustomPeriod(dataRetentionPeriod)
        optionsToRender.push(
          <MenuItem key={daysNumber || value} value={key}>
            {t(value, { count: daysNumber })}
          </MenuItem>,
        )
      }

      optionsToRender = optionsToRender.concat(
        OptionsScope.filter(opt => !opt.daysNumber || opt.daysNumber <= dataRetentionPeriod).map(opt =>
          dropdownOptionFactory(opt, t),
        ),
      )
      return optionsToRender
    },
    [t],
  )

  const renderDropdown = useMemo(() => {
    const dropdownValue = (state.showDatePicker && Periods.CUSTOM.key) || context.last || ''
    return (
      <div className={styles.optionContainer}>
        <Select
          size="small"
          className={styles.dropdown}
          wrapperClassName={styles.dropdownWrapper}
          label={t('dashboard.date.rangeFilter')}
          labelId="range-picker-select-label"
          onChange={onSelect}
          value={dropdownValue}
          inputProps={{ 'data-testid': 'range-picker-select' }}
        >
          {context.last ? null : <MenuItem value="">{getTimeRange(context, t)}</MenuItem>}
          {getDropdownOptions(dataRetentionPeriod).map(opt => opt)}
          {context.last ? <MenuItem value={Periods.CUSTOM.key}>{t(Periods.CUSTOM.value)}</MenuItem> : null}
        </Select>
      </div>
    )
  }, [context, dataRetentionPeriod, getDropdownOptions, onSelect, state.showDatePicker, t])

  return (
    <>
      {renderDropdown}
      {(state.showDatePicker || context.start) && renderPicker}
    </>
  )
})
RangePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  dataRetentionPeriod: PropTypes.number.isRequired,
}

export default RangePicker
