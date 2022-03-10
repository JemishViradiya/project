// dependencies
import cond from 'lodash/cond'
import flow from 'lodash/flow'
import type { Moment, MomentInput } from 'moment'
import moment from 'moment'

import type { UesTheme } from '@ues/assets'

// utils
import { OPERATOR_VALUES } from './filters.constants'

const evaluateDatePickerFilter = (
  dateFilter: { date: MomentInput; operator: OPERATOR_VALUES; ignoreTime?: boolean },
  dateValue: MomentInput,
): boolean => {
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

const renderDayOverride = (theme: UesTheme, isInvalid: boolean) => (
  day: Moment,
  selectedDate: Moment,
  _dayInCurrentMonth: unknown,
  dayComponent: React.DetailedReactHTMLElement<React.HTMLAttributes<unknown>, any>,
): React.DetailedReactHTMLElement<React.HTMLAttributes<unknown>, any> =>
  isInvalid && !day.diff(selectedDate)
    ? {
        ...dayComponent,
        props: {
          ...dayComponent.props,
          style: {
            backgroundColor: theme.props.colors.grey[300],
            color: theme.palette.text.secondary,
          },
        },
      }
    : dayComponent

const getFieldOperatorValueLabel = (fieldLabel: string, operatorLabel: string, filterValue: string): string =>
  flow([
    filterLabel => (operatorLabel ? `${filterLabel} ${operatorLabel}` : filterLabel),
    filterLabel => `${filterLabel} ${filterValue}`,
  ])(fieldLabel)

export { evaluateDatePickerFilter, renderDayOverride, getFieldOperatorValueLabel }
