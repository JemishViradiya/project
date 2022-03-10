import type { Moment } from 'moment'
import moment from 'moment'

enum FilterQueryKey {
  'userName',
  'clientName',
  'eventType',
  'locations',
  'violationTime',
}

type FilterQueryValue = {
  operator: string
  value: string | Moment
}

interface ActiveFilters {
  FilterQueryKey: FilterQueryValue
}

export const buildEventListQuery = (activeFilters: ActiveFilters | Partial<ActiveFilters>) => {
  let filterQuery = {}
  Object.entries(activeFilters).forEach(filter => {
    if (filter[0] === 'violationTime') {
      const startDayFilterTimestamp = moment(filter[1].value).startOf('day').valueOf()
      const endDayFilterTimestamp = moment(filter[1].value).endOf('day').valueOf()
      filterQuery = {
        ...filterQuery,
        startTime: startDayFilterTimestamp,
        stopTime: endDayFilterTimestamp,
      }
    } else if (filter[0] === 'eventType') {
      filterQuery = { ...filterQuery, [filter[0]]: filter[1].value.replace(' ', '_').toUpperCase() }
    } else {
      filterQuery = { ...filterQuery, [filter[0]]: `*${filter[1].value}*` }
    }
  })
  return filterQuery
}
