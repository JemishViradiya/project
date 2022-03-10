// dependencies
import moment from 'moment'
import React from 'react'

// components
import { BooleanFilter } from './BooleanFilter.stories'
import { CheckboxFilter } from './CheckboxFilter.stories'
import { DatePickerFilter } from './DatePickerFilter.stories'
import { DateRangeFilter } from './DateRangeFilter.stories'
import { DatetimeRangeFilter } from './DatetimeRangeFilter.stories'
// utils
import { FILTER_TYPES, OPERATOR_VALUES } from './filters.constants'
import { NumericFilter } from './NumericFilter.stories'
import { NumericNoRangeFilter } from './NumericNoRangeFilter.stories'
import { NumericRangeFilter } from './NumericRangeFilter.stories'
import { QuickSearchFilter } from './QuickSearchFilter.stories'
import { RadioFilter } from './RadioFilter.stories'

const evaluateDatePickerFilter = (dateFilter, dateValue) => {
  const { date, operator, ignoreTime } = dateFilter

  if (!date) {
    return false
  }

  const diff = cond([
    [
      () => ignoreTime,
      () => {
        // --NOTE: `format` below is used only to remove time from the date
        //         value `diff` evaluation - it will not be displayed anywhere
        const filterDate = moment(date).format('MM-DD-YYYY')
        const dataDate = moment(dateValue).format('MM-DD-YYYY')

        return moment(filterDate).diff(moment(dataDate))
      },
    ],
    [() => true, () => moment(date).diff(moment(dateValue))],
  ])(undefined)

  switch (operator) {
    case OPERATOR_VALUES.AFTER_OR_EQUAL:
      return diff <= 0
    case OPERATOR_VALUES.AFTER:
      return diff < 0
    case OPERATOR_VALUES.BEFORE_OR_EQUAL:
      return diff >= 0
    case OPERATOR_VALUES.BEFORE:
      return diff > 0
    case OPERATOR_VALUES.EQUAL:
      return diff === 0
    default:
      return false
  }
}

const renderFilter = (type, props) => {
  switch (type) {
    case FILTER_TYPES.BOOLEAN:
      return <BooleanFilter {...props} />
    case FILTER_TYPES.CHECKBOX:
      return <CheckboxFilter {...props} />
    case FILTER_TYPES.DATE_PICKER:
      return <DatePickerFilter {...props} />
    case FILTER_TYPES.DATE_RANGE:
      return <DateRangeFilter {...props} />
    case FILTER_TYPES.DATETIME_RANGE:
      return <DatetimeRangeFilter {...props} />
    case FILTER_TYPES.NUMERIC:
      return <NumericFilter {...props} />
    case FILTER_TYPES.NUMERIC_RANGE:
      return <NumericRangeFilter {...props} />
    case FILTER_TYPES.NUMERIC_NO_RANGE:
      return <NumericNoRangeFilter {...props} />
    case FILTER_TYPES.QUICK_SEARCH:
      return <QuickSearchFilter {...props} />
    case FILTER_TYPES.RADIO:
      return <RadioFilter {...props} />
    default:
      return null
  }
}

const renderDayOverride = (theme, isInvalid) => (day, selectedDate, _dayInCurrentMonth, dayComponent) => {
  if (isInvalid && !day.diff(selectedDate)) {
    return {
      ...dayComponent,
      props: {
        ...dayComponent.props,
        style: {
          backgroundColor: theme.props.colors.grey[300],
          color: theme.palette.text.primary,
        },
      },
    }
  }

  if (!day.diff(selectedDate)) {
    return {
      ...dayComponent,
      props: {
        ...dayComponent.props,
        style: {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
        },
      },
    }
  }

  return dayComponent
}

export { evaluateDatePickerFilter, renderFilter, renderDayOverride }
