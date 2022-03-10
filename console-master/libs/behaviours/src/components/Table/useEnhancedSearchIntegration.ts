//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useCallback, useMemo } from 'react'

import type { FilterWithEnhancedSearchProps } from '../../filters'
import { FILTER_TYPES, OPERATOR_VALUES } from '../../filters'
import type {
  EnhancedFieldConfig,
  EnhancedSearchInitialValue,
  EnhancedSearchOnChangeValues,
  EnhancedSearchProps,
} from '../EnhancedSearch'
import { EnhancedSearchComparisonType } from '../EnhancedSearch'
import type { TableColumn } from './types'

const operatorsMapping = {
  [FILTER_TYPES.CHECKBOX]: {
    [EnhancedSearchComparisonType.Contains]: OPERATOR_VALUES.IS_IN,
    [OPERATOR_VALUES.IS_IN]: EnhancedSearchComparisonType.Contains,
  },
  [FILTER_TYPES.NUMERIC]: {
    [OPERATOR_VALUES.EQUAL]: EnhancedSearchComparisonType.Contains,
    [EnhancedSearchComparisonType.Contains]: OPERATOR_VALUES.EQUAL,

    [OPERATOR_VALUES.DOES_NOT_CONTAIN]: EnhancedSearchComparisonType.DoesNotContain,
    [EnhancedSearchComparisonType.DoesNotContain]: OPERATOR_VALUES.DOES_NOT_CONTAIN,

    [OPERATOR_VALUES.STARTS_WITH]: EnhancedSearchComparisonType.StartsWith,
    [EnhancedSearchComparisonType.StartsWith]: OPERATOR_VALUES.STARTS_WITH,

    [OPERATOR_VALUES.ENDS_WITH]: EnhancedSearchComparisonType.EndsWith,
    [EnhancedSearchComparisonType.EndsWith]: OPERATOR_VALUES.ENDS_WITH,

    [OPERATOR_VALUES.GREATER]: EnhancedSearchComparisonType.Greater,
    [EnhancedSearchComparisonType.Greater]: OPERATOR_VALUES.GREATER,

    [OPERATOR_VALUES.GREATER_OR_EQUAL]: EnhancedSearchComparisonType.GreaterOrEqual,
    [EnhancedSearchComparisonType.GreaterOrEqual]: OPERATOR_VALUES.GREATER_OR_EQUAL,

    [OPERATOR_VALUES.LESS]: EnhancedSearchComparisonType.Less,
    [EnhancedSearchComparisonType.Less]: OPERATOR_VALUES.LESS,

    [OPERATOR_VALUES.LESS_OR_EQUAL]: EnhancedSearchComparisonType.LessOrEqual,
    [EnhancedSearchComparisonType.LessOrEqual]: OPERATOR_VALUES.LESS_OR_EQUAL,
  },
  [FILTER_TYPES.NUMERIC_RANGE]: {
    [EnhancedSearchComparisonType.Contains]: OPERATOR_VALUES.IS_BETWEEN,
    [OPERATOR_VALUES.IS_BETWEEN]: EnhancedSearchComparisonType.Contains,
  },
}

const getEnhancedSearchValueFromTableFilter = {
  [FILTER_TYPES.CHECKBOX]: (filterValue: (number | string)[], options) => {
    return filterValue.map(value => ({
      ...options.find(option => value === option.value),
    }))
  },
  [FILTER_TYPES.NUMERIC]: filterValue => ({ value: filterValue, label: filterValue }),
  [FILTER_TYPES.NUMERIC_RANGE]: (filterValue: number[]) => {
    return filterValue.map(value => ({ value }))
  },
}

type TableFilterEnhancedSearchCommonProps = 'dataKey' | 'label' | 'filterType' | 'min' | 'max' | 'unit' | 'options'

export type TableFilterEnhancedSearchCombinedProps = Pick<TableColumn, TableFilterEnhancedSearchCommonProps> & {
  tableProps: Omit<TableColumn, TableFilterEnhancedSearchCommonProps>
  enhancedSearchProps: Omit<EnhancedFieldConfig, 'type' | TableFilterEnhancedSearchCommonProps>
}

interface EnhancedSearchIntegrationData {
  tableColumns: TableColumn[]
  enhancedSearchFields: EnhancedFieldConfig[]
  onEnhancedSearchChange: EnhancedSearchProps['onChange']
  enhancedSearchValues: EnhancedSearchInitialValue[]
}

/**
 * useEnhancedSearchIntegration hook allows integration of EnhancedSearch with table filter.
 * @param {FilterWithEnhancedSearchProps} filterData Table filter state from useFilterWithEnhancedSearch hook.
 * @param {TableFilterEnhancedSearchCombinedProps[]} combinedProps Combined props of table columns and EnhancedSearch fields.
 * @param {EnhancedFieldConfig[]} enhancedSearchExtraFields EnhancedSearch extra fields that are not present in the table columns.
 * @returns {EnhancedSearchIntegrationData} integration data.
 */
export const useEnhancedSearchIntegration = (
  filterData: FilterWithEnhancedSearchProps<any>,
  combinedProps: TableFilterEnhancedSearchCombinedProps[],
  enhancedSearchExtraFields?: EnhancedFieldConfig[],
): EnhancedSearchIntegrationData => {
  const { filterProps, updatedByTableFilter } = filterData

  const { tableColumns, enhancedSearchFields } = useMemo(() => {
    const columns = []
    const fields = []

    combinedProps.forEach(prop => {
      let column = {}
      let field = {}

      Object.entries(prop).forEach(([key, value]) => {
        switch (true) {
          case key === 'enhancedSearchProps':
            field = Object.assign(field, value)
            break
          case key === 'tableProps':
            column = Object.assign(column, value)
            break
          default:
            // eslint-disable-next-line no-case-declarations
            const fieldKey = key === 'filterType' ? 'type' : key

            column[key] = value
            field[fieldKey] = value
        }
      })

      columns.push(column)
      fields.push(field)
    })

    const enhancedSearchFields = enhancedSearchExtraFields ? [...fields, ...enhancedSearchExtraFields] : fields

    return {
      tableColumns: columns,
      enhancedSearchFields,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combinedProps])

  const onEnhancedSearchChange = useCallback((enhancedSearchOnChangeValues: EnhancedSearchOnChangeValues[], key: string) => {
    if (!key) {
      filterProps.onClearFilters()
    } else {
      const tableFilters = enhancedSearchOnChangeValues.reduce((filters, { dataKey, value, operator: _op, type }) => {
        const emptyFilter = value === '' || (Array.isArray(value) && !value.length)
        if (emptyFilter) {
          return filters
        }

        const operator = operatorsMapping[type][_op]
        filters[dataKey] = { value, operator }

        return filters
      }, {})

      filterProps.onSetAllFilters(tableFilters)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const enhancedSearchValues = useMemo(() => {
    if (updatedByTableFilter) {
      return Object.entries(filterProps.activeFilters).map(([dataKey, filter]) => {
        const { type, options } = enhancedSearchFields.find(field => dataKey === field.dataKey)
        const { value, operator } = filter as { [key: string]: any }

        const enhancedSearchValue = getEnhancedSearchValueFromTableFilter[type](value, options)

        return {
          dataKey,
          value: enhancedSearchValue,
          operator: operatorsMapping[type][operator],
        }
      })
    }

    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterProps.activeFilters])

  return {
    tableColumns,
    enhancedSearchFields,
    onEnhancedSearchChange,
    enhancedSearchValues,
  }
}
