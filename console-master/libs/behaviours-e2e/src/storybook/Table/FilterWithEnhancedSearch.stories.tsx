import React, { useMemo } from 'react'

import Card from '@material-ui/core/Card'

import type { TableFilterEnhancedSearchCombinedProps } from '@ues/behaviours'
import {
  AppliedFilterPanel,
  BasicTable,
  CheckboxFilter,
  ColumnPicker,
  EnhancedSearch,
  EnhancedSearchComparisonType,
  FILTER_TYPES,
  NumericFilter,
  NumericFilterUnits,
  NumericRangeFilter,
  SimpleFilter,
  TableProvider,
  TableToolbar,
  useCheckboxFilter,
  useClientFilter,
  useColumnPicker,
  useColumnProps,
  useEnhancedSearchIntegration,
  useFilterLabels,
  useFilterWithEnhancedSearch,
  useNumericFilter,
  useNumericRangeFilter,
  useSelected,
  useTableFilter,
} from '@ues/behaviours'

import { getFatItemsLocalization, getMockData } from './table.data'

const ROW_DATA = getMockData()

const idFunction = row => row.id

const PercentValueComponent = dataKey => rowData => `${rowData[dataKey]}%`

const FilterWithEnhancedSearchTable = ({ selection, columnPicker, enhancedSearch }) => {
  const FatFilterComponent = () => {
    const filterProps = useTableFilter<SimpleFilter<number[]>>()
    const { dataKey, label, options } = useColumnProps('fat')
    const props = useCheckboxFilter({ filterProps, key: dataKey })
    return <CheckboxFilter label={label} items={options} {...props} />
  }

  const CaloriesFilterComponent = () => {
    const filterProps = useTableFilter<SimpleFilter<number>>()
    const { dataKey, min, max, label } = useColumnProps('calories')
    const props = useNumericFilter({ filterProps, key: dataKey })
    return <NumericFilter label={label} min={min} max={max} {...props} />
  }

  const CarbsFilterComponent = () => {
    const filterProps = useTableFilter<SimpleFilter<[number, number]>>()
    const { dataKey, min, max, unit, label } = useColumnProps('carbs')
    const props = useNumericRangeFilter({ filterProps, key: dataKey, min, max, unit })
    return <NumericRangeFilter label={label} {...props} />
  }

  const combinedProps: TableFilterEnhancedSearchCombinedProps[] = useMemo(
    () => [
      {
        dataKey: 'calories',
        label: 'Calories',
        filterType: FILTER_TYPES.NUMERIC,
        min: 0,
        max: 200,
        tableProps: {
          renderFilter: () => <CaloriesFilterComponent />,
        },
        enhancedSearchProps: {
          customOperators: [
            EnhancedSearchComparisonType.Contains,
            EnhancedSearchComparisonType.Greater,
            EnhancedSearchComparisonType.GreaterOrEqual,
            EnhancedSearchComparisonType.Less,
            EnhancedSearchComparisonType.LessOrEqual,
          ],
        },
      },
      {
        dataKey: 'fat',
        label: 'Fat',
        filterType: FILTER_TYPES.CHECKBOX,
        options: [
          { label: '6.0%', value: 6.0 },
          { label: '9.0%', value: 9.0 },
          { label: '16.0%', value: 16.0 },
          { label: '3.7%', value: 3.7 },
        ],
        tableProps: {
          renderFilter: () => <FatFilterComponent />,
          renderCell: PercentValueComponent('fat'),
        },
        enhancedSearchProps: {
          customOperators: [EnhancedSearchComparisonType.Contains],
          preselectComparison: true,
        },
      },
      {
        dataKey: 'carbs',
        label: 'Carbs',
        filterType: FILTER_TYPES.NUMERIC_RANGE,
        min: 0,
        max: 100,
        unit: NumericFilterUnits.Percent,
        tableProps: {
          renderFilter: () => <CarbsFilterComponent />,
          renderCell: PercentValueComponent('carbs'),
        },
        enhancedSearchProps: {
          customOperators: [EnhancedSearchComparisonType.Contains],
          preselectComparison: true,
        },
      },
    ],
    [],
  )

  const enhancedSearchExtraFields = useMemo(
    () => [
      {
        dataKey: 'protein',
        label: 'Protein',
        type: FILTER_TYPES.NUMERIC,
        min: 0,
        max: 10,
        customOperators: [EnhancedSearchComparisonType.Contains],
        preselectComparison: true,
      },
    ],
    [],
  )

  const FilterWithEnhancedSearchComponent = () => {
    const filter = useFilterWithEnhancedSearch({})
    const { filterProps } = filter
    const {
      onEnhancedSearchChange,
      enhancedSearchValues,
      tableColumns: columns,
      enhancedSearchFields: fields,
    } = useEnhancedSearchIntegration(filter, combinedProps, enhancedSearchExtraFields)

    const activeFiltersForLabels = enhancedSearch ? [] : filterProps.activeFilters

    const filterLabelProps = useFilterLabels(activeFiltersForLabels, columns, {
      ...getFatItemsLocalization(),
    })
    const filteredData = useClientFilter({ data: ROW_DATA, activeFilters: filterProps.activeFilters, filterProps: fields })

    const { displayedColumns, columnPickerProps } = useColumnPicker({ columns, title: 'Table columns' })
    const selectionProps = useSelected('id')

    const basicProps = useMemo(
      () => ({
        columns: columnPicker ? displayedColumns : columns,
        columnPicker: columnPicker ? props => <ColumnPicker {...columnPickerProps} {...props} /> : undefined,
        idFunction,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [displayedColumns, columnPickerProps],
    )

    return (
      <Card>
        <TableToolbar
          bottom={
            enhancedSearch ? (
              <EnhancedSearch
                fields={fields}
                onChange={onEnhancedSearchChange}
                showChipSeparator={true}
                disabled={false}
                externalValues={enhancedSearchValues}
              />
            ) : (
              <AppliedFilterPanel {...filterProps} {...filterLabelProps} />
            )
          }
        />
        <TableProvider basicProps={basicProps} selectedProps={selection ? selectionProps : undefined} filterProps={filterProps}>
          <BasicTable data={filteredData} noDataPlaceholder="No data" />
        </TableProvider>
      </Card>
    )
  }

  return <FilterWithEnhancedSearchComponent />
}

export const FilterWithEnhancedSearch = FilterWithEnhancedSearchTable.bind({})

FilterWithEnhancedSearch.args = {
  enhancedSearch: true,
  selection: true,
  columnPicker: true,
}
