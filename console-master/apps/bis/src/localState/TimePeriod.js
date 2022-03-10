import { TimePeriodDataKey, TimePeriodQuery, TimePeriodUpdateKey, TimePeriodUpdateMutation } from '@ues-data/bis'
import { ApolloDataUtils } from '@ues-data/shared'

import { Periods } from '../components/util/DateHelper'

export const dataKey = TimePeriodDataKey
export const updateKey = TimePeriodUpdateKey
export const getTimePeriodQuery = TimePeriodQuery
export const { query } = getTimePeriodQuery
export const updateTimePeriodMutation = TimePeriodUpdateMutation
export const typename = `type_${dataKey}`
export const load = () => {
  const rawValue = localStorage.getItem('timePeriod')
  let savedValue
  try {
    savedValue = JSON.parse(rawValue)
    // eslint-disable-next-line no-empty
  } catch (e) {}
  if (!savedValue || typeof savedValue !== 'object') {
    return { __typename: typename, last: Periods.LAST_DAY.key, start: null, end: null, daysNumber: null }
  }
  savedValue = { __typename: typename, last: null, start: null, end: null, daysNumber: null, ...savedValue }
  return savedValue
}

export const update = (_, { last, start, end, daysNumber }, { cache }) => {
  if (last || start || end || daysNumber) {
    const previous = ApolloDataUtils.getApolloCachedValue(cache, { query })
    const data = {
      [dataKey]: {
        __typename: typename,
        ...previous[dataKey],
        last: last || null,
        start: start || null,
        end: end || null,
        daysNumber: daysNumber || null,
      },
    }
    cache.writeQuery({ query, data })
    localStorage.setItem('timePeriod', JSON.stringify({ last, start, end, daysNumber }))
  }
  return null
}
