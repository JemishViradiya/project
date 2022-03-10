// dependencies
import cond from 'lodash/cond'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'

// utils
import { FILTER_TYPES, OPERATOR_VALUES } from './meetsFilter.constants'

const evaluateDatePickerFilter = (dateFilter, dateValue) => {
  const { value, operator, ignoreTime } = dateFilter

  if (!value) {
    return false
  }

  const diff = cond([
    [
      () => ignoreTime,
      () => {
        // --NOTE: `format` below is used only to remove time from the date
        //         value `diff` evaluation - it will not be displayed anywhere
        const filterDate = moment(value).format('MM-DD-YYYY')
        const dataDate = moment(dateValue).format('MM-DD-YYYY')

        return moment(filterDate).diff(moment(dataDate))
      },
    ],
    [() => true, () => moment(value).diff(moment(dateValue))],
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

const evaluateDateRangeFilter = (
  accessorMin: string,
  accessorMax: string,
  dateFilter: {
    value: moment.MomentInput
    operator: OPERATOR_VALUES
  },
  dateValue: moment.MomentInput,
): boolean => {
  const minDate = dateFilter[accessorMin]
  const maxDate = dateFilter[accessorMax]

  if (!minDate || !maxDate) {
    // no date range => everything passes
    return true
  }

  return moment(minDate).isSameOrBefore(dateValue) && moment(maxDate).isSameOrAfter(dateValue)
}

const evaluateNumericFilter = (activeValue, value) => {
  if (activeValue.value === null) return true
  switch (activeValue.operator) {
    case OPERATOR_VALUES.GREATER_OR_EQUAL:
      return value >= activeValue.value
    case OPERATOR_VALUES.GREATER:
      return value > activeValue.value
    case OPERATOR_VALUES.LESS_OR_EQUAL:
      return value <= activeValue.value
    case OPERATOR_VALUES.LESS:
      return value < activeValue.value
    case OPERATOR_VALUES.EQUAL:
      return value === activeValue.value
  }
}

const formatFilterValue = filterValue => filterValue.value.map(value => value.value)

const meetsFilter = <TValue extends string = string>(
  value: TValue,
  filterValue: {
    value: TValue
    operator: OPERATOR_VALUES
    ignoreTime?: boolean
  },
  filterType: FILTER_TYPES,
): boolean => {
  if (isEmpty(filterValue)) {
    // no filter set for this key => row passes
    return true
  }
  switch (filterType) {
    case FILTER_TYPES.BOOLEAN:
    case FILTER_TYPES.RADIO:
      return filterValue.value === value
    case FILTER_TYPES.CHECKBOX:
      return filterValue.value.includes(value)
    case FILTER_TYPES.DATE_PICKER:
      return evaluateDatePickerFilter(filterValue, value)
    case FILTER_TYPES.DATE_RANGE:
      return evaluateDateRangeFilter('minDate', 'maxDate', filterValue, value)
    case FILTER_TYPES.DATETIME_RANGE:
      return evaluateDateRangeFilter('minDatetime', 'maxDatetime', filterValue, value)
    case FILTER_TYPES.NUMERIC_RANGE:
      return value >= filterValue.value[0] && value <= filterValue.value[1]
    case FILTER_TYPES.NUMERIC:
      return evaluateNumericFilter(filterValue, parseInt(value))
    case FILTER_TYPES.QUICK_SEARCH:
      return cond([
        [() => !filterValue.value, () => true],
        [
          () => Boolean(filterValue.operator),
          () => {
            // eslint-disable-next-line sonarjs/no-nested-switch
            switch (filterValue.operator) {
              case OPERATOR_VALUES.CONTAINS:
                return value.toLowerCase().includes(filterValue.value.toLowerCase())
              case OPERATOR_VALUES.DOES_NOT_CONTAIN:
                return !value.toLowerCase().includes(filterValue.value.toLowerCase())
              case OPERATOR_VALUES.STARTS_WITH:
                return value.toLowerCase().startsWith(filterValue.value.toLowerCase())
              case OPERATOR_VALUES.ENDS_WITH:
                return value.toLowerCase().endsWith(filterValue.value.toLowerCase())
              default:
                return false
            }
          },
        ],
        [() => true, () => value.toLowerCase().indexOf(filterValue.value.toLowerCase()) >= 0],
      ])(undefined)
    default:
      // unknown filter => row doesn't pass
      return false
  }
}
export { evaluateDateRangeFilter, meetsFilter }
