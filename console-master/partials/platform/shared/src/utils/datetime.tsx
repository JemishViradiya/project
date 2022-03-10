import type { Moment } from 'moment'

import type { DatetimeRangeFilter } from '@ues/behaviours'

const prepareDate = (dateTime: Moment) => {
  return dateTime.toISOString().replace(/\.\d{3}Z/, '')
}

export const serializeDateRangeForBffGrid = (field: string, rawValue = {} as DatetimeRangeFilter): string => {
  const { maxDatetime, minDatetime } = rawValue
  if (!maxDatetime || !minDatetime) return ''
  return `${field}=${prepareDate(minDatetime)}~${prepareDate(maxDatetime)}`
}

export const getNonLocalizedDate = dateString => {
  const dateObject = new Date(dateString)
  const date = dateObject.toLocaleDateString()
  const time = dateObject.toLocaleTimeString()
  const timezone = dateObject.getTimezoneOffset() / 60

  const timezoneWithSign = timezone < 0 ? timezone : `+${timezone}`
  return `${date} ${time} (${timezoneWithSign} GMT)`
}
