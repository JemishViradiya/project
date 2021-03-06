/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const FILTER_TYPES = {
  BOOLEAN: 'BOOLEAN' as const,
  CHECKBOX: 'CHECKBOX' as const,
  DATETIME_RANGE: 'DATETIME_RANGE' as const,
  DATE_PICKER: 'DATE_PICKER' as const,
  DATE_RANGE: 'DATE_RANGE' as const,
  LIST: 'LIST' as const,
  NUMERIC: 'NUMERIC' as const,
  NUMERIC_NO_RANGE: 'NUMERIC_NO_RANGE' as const,
  NUMERIC_RANGE: 'NUMERIC_RANGE' as const,
  OBJECT_AUTOCOMPLETE: 'OBJECT_AUTOCOMPLETE' as const,
  QUICK_SEARCH: 'QUICK_SEARCH' as const,
  RADIO: 'RADIO' as const,
  RISK: 'RISK' as const,
  TEXT: 'TEXT' as const,
}
// eslint-disable-next-line no-redeclare
type FILTER_TYPES = keyof typeof FILTER_TYPES

const FILTER_VALUES = {
  [FILTER_TYPES.BOOLEAN]: filter => filter,
  [FILTER_TYPES.CHECKBOX]: filter => filter,
  [FILTER_TYPES.DATE_PICKER]: filter => filter.date,
  [FILTER_TYPES.DATE_RANGE]: filter => [filter.minDate, filter.maxDate],
  [FILTER_TYPES.DATETIME_RANGE]: filter => [filter.minDatetime, filter.maxDatetime],
  [FILTER_TYPES.NUMERIC]: filter => filter.number,
  [FILTER_TYPES.NUMERIC_RANGE]: filter => filter,
  [FILTER_TYPES.NUMERIC_NO_RANGE]: filter => filter.number,
  [FILTER_TYPES.QUICK_SEARCH]: filter => filter.value,
  [FILTER_TYPES.RADIO]: filter => filter,
}

const OPERATOR_VALUES = {
  AFTER_OR_EQUAL: 'afterOrEqual',
  AFTER: 'after',
  BEFORE_OR_EQUAL: 'beforeOrEqual',
  BEFORE: 'before',
  GREATER_OR_EQUAL: 'greaterOrEqual',
  GREATER: 'greater',
  LESS_OR_EQUAL: 'lessOrEqual',
  LESS: 'less',
  EQUAL: 'equal',
  CONTAINS: 'contains',
  DOES_NOT_CONTAIN: 'doesNotContain',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
} as const
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
  FILTER_TYPES,
  FILTER_VALUES,
  OPERATOR_VALUES,
  DEFAULT_DATE_OPERATOR_VALUE,
  DEFAULT_NUMERIC_OPERATOR_VALUE,
  DEFAULT_STRING_OPERATOR_VALUE,
  DATE_OPERATORS,
  NUMERIC_OPERATORS,
  STRING_OPERATORS,
}
