// dependencies
import get from 'lodash/get'
import omit from 'lodash/omit'
import { useCallback, useState } from 'react'

import type { OPERATOR_VALUES } from './filters.constants'

type SimpleFilter<T> = {
  value: T
  operator?: OPERATOR_VALUES
  label?: string
  formatter?: (value: T) => string
  ignoreTime?: boolean
}
type CustomFilter<T> = T & { operator?: OPERATOR_VALUES }
type Labels<T extends string | number> = Record<T, string>

type FilterProps<TFilter> = {
  activeFilters: Record<string, TFilter[]>
  onSelectFilter(f: TFilter): void
  onSetFilter(f: { key: string; value: TFilter } | TFilter): void
  onRemoveFilter(key: string): void
  onClearFilters(): void
}

const useFilter = <TFilter extends unknown>(defaultActiveFilters: Record<string, TFilter[]> = {}): FilterProps<TFilter> => {
  const [activeFilters, setActiveFilters] = useState(defaultActiveFilters)

  const onSelectFilter = useCallback(
    filter => {
      const filterValues = get(activeFilters, filter.key, [])
      const valueIndex = filterValues.indexOf(filter.value)

      const newFilters = {
        ...activeFilters,
        [filter.key]:
          valueIndex >= 0
            ? // remove filter value
              filterValues.filter((_value, index) => index !== valueIndex)
            : // add filter value
              [...filterValues, filter.value],
      }

      setActiveFilters(newFilters)
    },
    [activeFilters],
  )

  const onSetFilter = useCallback(
    filter => {
      const newFilters = {
        ...activeFilters,
        [filter.key]: filter.value,
      }

      if (!filter.value) {
        delete newFilters[filter.key]
      }

      setActiveFilters(newFilters)
    },
    [activeFilters],
  )

  const onRemoveFilter = useCallback(
    filterKey => {
      const newFilters = omit(activeFilters, filterKey)
      setActiveFilters(newFilters)
    },
    [activeFilters],
  )

  const onClearFilters = useCallback(() => {
    setActiveFilters({})
  }, [])

  // hook interface
  return {
    activeFilters,
    onSelectFilter,
    onSetFilter,
    onRemoveFilter,
    onClearFilters,
  }
}

type FilterWithEnhancedSearchProps<TFilter> = {
  filterProps: FilterProps<TFilter> & { onSetAllFilters(f: Record<string, TFilter[]>): void }
  updatedByTableFilter: boolean
}

/**
 * useFilterWithEnhancedSearch hook generates filter state and methods to update it.
 * Added updatedByTableFilter state to handle EnhancedSearch state update.
 * @param {Object} defaultActiveFilters Default active filters.
 * @returns {FilterWithEnhancedSearchProps} filter state and methods to update it.
 */
const useFilterWithEnhancedSearch = <TFilter extends unknown>(
  defaultActiveFilters: Record<string, TFilter[]> = {},
): FilterWithEnhancedSearchProps<TFilter> => {
  const [activeFilters, setActiveFilters] = useState(defaultActiveFilters)
  const [updatedByTableFilter, setUpdatedByTableFilter] = useState(true)

  const onSelectFilter = useCallback(
    // eslint-disable-next-line sonarjs/no-identical-functions
    filter => {
      const filterValues = get(activeFilters, filter.key, [])
      const valueIndex = filterValues.indexOf(filter.value)

      const newFilters = {
        ...activeFilters,
        [filter.key]:
          valueIndex >= 0
            ? // remove filter value
              filterValues.filter((_value, index) => index !== valueIndex)
            : // add filter value
              [...filterValues, filter.value],
      }

      setActiveFilters(newFilters)
    },
    [activeFilters],
  )

  const onSetFilter = useCallback(
    filter => {
      const newFilters = {
        ...activeFilters,
        [filter.key]: filter.value,
      }

      if (!filter.value) {
        delete newFilters[filter.key]
      }

      setUpdatedByTableFilter(true)
      setActiveFilters(newFilters)
    },
    [activeFilters],
  )

  const onSetAllFilters = useCallback(
    (filters: Record<string, TFilter[]>) => {
      const newFilters = {
        ...defaultActiveFilters,
        ...filters,
      }

      setUpdatedByTableFilter(false)
      setActiveFilters(newFilters)
    },
    [defaultActiveFilters],
  )

  const onRemoveFilter = useCallback(
    filterKey => {
      const newFilters = omit(activeFilters, filterKey)

      setUpdatedByTableFilter(true)
      setActiveFilters(newFilters)
    },
    [activeFilters],
  )

  const onClearFilters = useCallback(() => {
    setUpdatedByTableFilter(false)
    setActiveFilters({})
  }, [])

  // hook interface
  return {
    filterProps: {
      activeFilters,
      onSelectFilter,
      onSetFilter,
      onRemoveFilter,
      onClearFilters,
      onSetAllFilters,
    },
    updatedByTableFilter,
  }
}

export { useFilter, useFilterWithEnhancedSearch, FilterProps, FilterWithEnhancedSearchProps, SimpleFilter, CustomFilter, Labels }
