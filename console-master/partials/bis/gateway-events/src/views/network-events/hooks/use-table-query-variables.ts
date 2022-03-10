import { useMemo } from 'react'

import { serializeQueryParameter } from '@ues-data/shared'

import { ColumnKey } from '../types'
import { convertFilterDateRangeToRangeVariable } from '../utils/filters'

const FILTERS_VARIABLES_RESOLVERS: Partial<Record<ColumnKey, (filter: any) => Record<string, any>>> = {
  [ColumnKey.User]: filter => ({
    queryString: filter?.value ? serializeQueryParameter('displayName', filter) : null,
  }),
  [ColumnKey.Risk]: filter => ({
    behavioralRiskLevel: filter?.value ?? null,
  }),
  [ColumnKey.DetectionTime]: filter => ({
    range: convertFilterDateRangeToRangeVariable(filter),
  }),
}

const SORT_BY_PROPERTY_MAP = {
  [ColumnKey.DetectionTime]: 'datetime',
  [ColumnKey.Risk]: 'behavioralRiskLevel',
}
const COLUMNS_WITH_INVERTED_SORTING = new Set<ColumnKey>([ColumnKey.DetectionTime])

interface UseQueryVariablesOptions {
  filterProps: any
  sortProps: any
  size: number
  userIds: string[]
  containerIds?: string[]
}

const resolveSortDirection = (columnKey: ColumnKey, sortDirection: string) => {
  if (COLUMNS_WITH_INVERTED_SORTING.has(columnKey)) {
    return sortDirection === 'asc' ? 'DESC' : 'ASC'
  }

  return sortDirection === 'asc' ? 'ASC' : 'DESC'
}

export const useTableQueryVariables = ({ sortProps, filterProps, size, userIds, containerIds }: UseQueryVariablesOptions) => {
  const { sortBy, sortDirection } = useMemo(() => {
    return {
      sortBy: SORT_BY_PROPERTY_MAP[sortProps.sort],
      sortDirection: resolveSortDirection(sortProps.sort, sortProps.sortDirection),
    }
  }, [sortProps])

  return useMemo(() => {
    const sortVariables = sortBy ? { sortBy, sortDirection } : {}

    const filtersVariables = Object.entries({
      [ColumnKey.DetectionTime]: undefined,
      ...filterProps.activeFilters,
    }).reduce((acc, [columnKey, filter]) => {
      const resolver = FILTERS_VARIABLES_RESOLVERS[columnKey]

      return { ...acc, ...resolver(filter) }
    }, {})

    return {
      ...sortVariables,
      ...filtersVariables,
      userIds,
      containerIds,
      size,
      offset: 0,
    }
  }, [filterProps.activeFilters, sortBy, sortDirection, size, userIds, containerIds])
}
