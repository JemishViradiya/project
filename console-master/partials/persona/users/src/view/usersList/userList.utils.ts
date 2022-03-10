import moment from 'moment'

import type { UserItem } from '@ues-data/persona'
import type { SimpleFilter } from '@ues/behaviours'

import type { UserListFilters } from './userList.types'
import { UserListColumnKey } from './userList.types'

export const mapActiveFiltersToParams = (filters: UserListFilters): Record<string, string>[] => {
  const getFilterValue = (key: string, filter: SimpleFilter<string>) => [
    {
      [key]: filter?.value,
    },
  ]

  const getLastOnlineFilterValue = (filter: UserListFilters[UserListColumnKey.LastOnline]) => {
    const { minDate, maxDate } = filter

    if (minDate && maxDate) {
      return [
        {
          fromTime: moment(minDate).toISOString(),
        },
        {
          toTime: moment(maxDate).add('1', 'day').startOf('date').toISOString(),
        },
      ]
    }

    return []
  }

  const getUsernameFilterValue = (filter: UserListFilters[UserListColumnKey.Username]) => {
    const {
      value: { userName },
    } = filter

    return [{ userName }]
  }

  const getZonenameFilterValue = (filter: UserListFilters[UserListColumnKey.Zones]) => {
    const {
      value: { name },
    } = filter

    return [{ zones: name }]
  }

  const mapFilter = (key: string, filter): Record<string, string>[] => {
    switch (key) {
      case UserListColumnKey.LastOnline:
        return getLastOnlineFilterValue(filter)
      case UserListColumnKey.Username:
        return getUsernameFilterValue(filter)
      case UserListColumnKey.Zones:
        return getZonenameFilterValue(filter)

      default:
        return getFilterValue(key, filter)
    }
  }

  return Object.keys(filters)
    .map(key => mapFilter(key, filters[key]))
    .reduce((acc, val) => acc.concat(val), [])
}

export const idFunction = (rowData: UserItem) => rowData.id
