enum TimePeriod {
  LAST_HOUR = 'LAST_HOUR',
  LAST_DAY = 'LAST_DAY',
  LAST_WEEK = 'LAST_WEEK',
  LAST_MONTH = 'LAST_MONTH',
  LAST_QUARTER = 'LAST_QUARTER',
  LAST_YEAR = 'LAST_YEAR',
  LAST_CUSTOM_DAYS = 'LAST_CUSTOM_DAYS',
}

export type TimeRangeInput = {
  last: TimePeriod
  start: string
  end: string
  daysNumber: number
}
