export enum FILTER_TYPES {
  BOOLEAN = 'BOOLEAN',
  CHECKBOX = 'CHECKBOX',
  DATETIME_RANGE = 'DATETIME_RANGE',
  DATE_PICKER = 'DATE_PICKER',
  DATE_RANGE = 'DATE_RANGE',
  LIST = 'LIST',
  NUMERIC = 'NUMERIC',
  NUMERIC_NO_RANGE = 'NUMERIC_NO_RANGE',
  NUMERIC_RANGE = 'NUMERIC_RANGE',
  OBJECT_AUTOCOMPLETE = 'OBJECT_AUTOCOMPLETE',
  QUICK_SEARCH = 'QUICK_SEARCH',
  RADIO = 'RADIO',
  RISK = 'RISK',
  TEXT = 'TEXT',
}
// eslint-disable-next-line no-redeclare
export type FILTER_TYPE = typeof FILTER_TYPES[keyof typeof FILTER_TYPES]
