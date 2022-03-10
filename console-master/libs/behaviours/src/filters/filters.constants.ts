import { I18nFormats } from '@ues/assets'

import { FILTER_TYPES } from './types'

export const FILTER_VALUES = {
  [FILTER_TYPES.BOOLEAN]: filter => filter.value,
  [FILTER_TYPES.CHECKBOX]: filter => filter.value,
  [FILTER_TYPES.NUMERIC]: filter => filter.value,
  [FILTER_TYPES.NUMERIC_RANGE]: filter => filter.value,
  [FILTER_TYPES.NUMERIC_NO_RANGE]: filter => filter.value,
  [FILTER_TYPES.QUICK_SEARCH]: filter => filter.value,
  [FILTER_TYPES.RADIO]: filter => filter.value,
  [FILTER_TYPES.DATE_PICKER]: (filter, t, i18n) => i18n.format(filter.value, I18nFormats.Date),
  [FILTER_TYPES.DATE_RANGE]: (filter, t, i18n) => {
    return [filter.minDate && i18n.format(filter.minDate, I18nFormats.Date), i18n.format(filter.maxDate, I18nFormats.Date)]
  },
  [FILTER_TYPES.DATETIME_RANGE]: (filter, t, i18n) => {
    return [i18n.format(filter.minDatetime, I18nFormats.DateTimeShort), i18n.format(filter.maxDatetime, I18nFormats.DateTimeShort)]
  },
  [FILTER_TYPES.OBJECT_AUTOCOMPLETE]: filter => filter.label,
}

const OPERATOR_VALUES = {
  AFTER_OR_EQUAL: 'afterOrEqual' as const,
  AFTER: 'after' as const,
  BEFORE_OR_EQUAL: 'beforeOrEqual' as const,
  BEFORE: 'before' as const,
  GREATER_OR_EQUAL: 'greaterOrEqual' as const,
  GREATER: 'greater' as const,
  LESS_OR_EQUAL: 'lessOrEqual' as const,
  LESS: 'less' as const,
  EQUAL: 'equal' as const,
  CONTAINS: 'contains' as const,
  DOES_NOT_CONTAIN: 'doesNotContain' as const,
  STARTS_WITH: 'startsWith' as const,
  ENDS_WITH: 'endsWith' as const,
  IS_BETWEEN: 'isBetween' as const,
  IS_IN: 'isIn' as const,
}
// eslint-disable-next-line no-redeclare
type OPERATOR_VALUES = typeof OPERATOR_VALUES[keyof typeof OPERATOR_VALUES]

const DEFAULT_DATE_OPERATOR_VALUE = OPERATOR_VALUES.EQUAL
const DEFAULT_NUMERIC_OPERATOR_VALUE = OPERATOR_VALUES.EQUAL
const DEFAULT_STRING_OPERATOR_VALUE = OPERATOR_VALUES.CONTAINS

const DATE_OPERATORS = [
  OPERATOR_VALUES.AFTER_OR_EQUAL,
  OPERATOR_VALUES.AFTER,
  OPERATOR_VALUES.BEFORE_OR_EQUAL,
  OPERATOR_VALUES.BEFORE,
  OPERATOR_VALUES.EQUAL,
]

const NUMERIC_OPERATORS = [
  OPERATOR_VALUES.GREATER_OR_EQUAL,
  OPERATOR_VALUES.GREATER,
  OPERATOR_VALUES.LESS_OR_EQUAL,
  OPERATOR_VALUES.LESS,
  OPERATOR_VALUES.EQUAL,
]

const STRING_OPERATORS = [
  OPERATOR_VALUES.CONTAINS,
  OPERATOR_VALUES.DOES_NOT_CONTAIN,
  OPERATOR_VALUES.STARTS_WITH,
  OPERATOR_VALUES.ENDS_WITH,
]

export {
  OPERATOR_VALUES,
  DEFAULT_DATE_OPERATOR_VALUE,
  DEFAULT_NUMERIC_OPERATOR_VALUE,
  DEFAULT_STRING_OPERATOR_VALUE,
  DATE_OPERATORS,
  NUMERIC_OPERATORS,
  STRING_OPERATORS,
}
