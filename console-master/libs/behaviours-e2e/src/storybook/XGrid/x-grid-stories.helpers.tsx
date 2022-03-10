import type { Moment } from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { AsyncQuery, useStatefulAsyncQuery } from '@ues-data/shared'
import { BasicAllow } from '@ues/assets'
import type { CustomFilter, SimpleFilter, TableColumn } from '@ues/behaviours'
import {
  BooleanFilter,
  CheckboxFilter,
  ColumnPicker,
  DatePickerFilter,
  DateRangeFilter,
  DatetimeRangeFilter,
  FILTER_TYPES,
  NumericFilter,
  NumericFilterUnits,
  NumericRangeFilter,
  OPERATOR_VALUES,
  QuickSearchFilter,
  RadioFilter,
  STRING_OPERATORS,
  TableSortDirection,
  useBooleanFilter,
  useCheckboxFilter,
  useColumnPicker,
  useDatePickerFilter,
  useDateRangeFilter,
  useDatetimeRangeFilter,
  useFilter,
  useFilterLabels,
  useNumericFilter,
  useNumericRangeFilter,
  useQuickSearchFilter,
  useRadioFilter,
  useServerSideSelection,
  useSort,
  useTableFilter,
} from '@ues/behaviours'

import { getFatItemsLocalization, getFatValueItems, getProteinItemsLocalization, getProteinValueItems } from '../Table/table.data'
import { fetchXGridData } from '../Table/table.utils'

const PercentValueComponent = dataKey => rowData => `${rowData[dataKey]}%`

const MAX_ROW_LENGTH = 120

const IsYummyFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<boolean>>()
  const props = useBooleanFilter({ filterProps, key: 'isYummy' })
  return <BooleanFilter label="Is Yummy" optionLabel="Option" {...props} />
}

const FatFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<number[]>>()
  const props = useCheckboxFilter({ filterProps, key: 'fat' })
  return <CheckboxFilter label="Fat" items={getFatValueItems()} itemsLabels={getFatItemsLocalization()} {...props} />
}

const ProteinFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<number>>()
  const props = useRadioFilter({ filterProps, key: 'protein' })
  return <RadioFilter label="Protein" items={getProteinValueItems()} itemsLabels={getProteinItemsLocalization()} {...props} />
}

const CaloriesFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<number>>()
  const props = useNumericFilter({ filterProps, key: 'calories' })
  return <NumericFilter label="Calories" min={0} max={200} {...props} />
}

const CarbsFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<[number, number]>>()
  const props = useNumericRangeFilter({ filterProps, key: 'carbs', min: 0, max: 100, unit: NumericFilterUnits.Percent })
  return <NumericRangeFilter label="Carbs" min={0} max={100} {...props} />
}

const NameFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'name', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label="Dessert" operators={STRING_OPERATORS} {...props} />
}

const DateModifiedFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<Moment>>()
  const props = useDatePickerFilter({ filterProps, key: 'dateModified', defaultOperator: OPERATOR_VALUES.BEFORE })
  return <DatePickerFilter label="Date Modified" {...props} />
}

const DateCreatedFilterComponent = () => {
  const filterProps = useTableFilter<CustomFilter<DateRangeFilter>>()
  const props = useDateRangeFilter({ filterProps, key: 'dateCreated' })
  return <DateRangeFilter label="Date Created" {...props} />
}

const LastEatenFilterComponent = () => {
  const filterProps = useTableFilter<CustomFilter<DatetimeRangeFilter>>()
  const props = useDatetimeRangeFilter({ filterProps, key: 'lastEaten' })
  return <DatetimeRangeFilter label="Last Eaten" {...props} />
}

export const useXGridColumns = (): TableColumn[] =>
  useMemo(
    () => [
      {
        dataKey: 'name',
        label: 'Dessert (100g serving)',
        persistent: true,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <NameFilterComponent />,
        gridColDefProps: { minWidth: 220, flex: 2 },
      },
      {
        dataKey: 'calories',
        label: 'Calories',
        filterType: FILTER_TYPES.NUMERIC,
        sortable: true,
        renderFilter: () => <CaloriesFilterComponent />,
      },
      {
        dataKey: 'fat',
        label: 'Fat',
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <FatFilterComponent />,
        renderCell: PercentValueComponent('fat'),
      },
      {
        dataKey: 'carbs',
        label: 'Carbs',
        persistent: true,
        filterType: FILTER_TYPES.NUMERIC_RANGE,
        renderFilter: () => <CarbsFilterComponent />,
        renderCell: PercentValueComponent('carbs'),
        gridColDefProps: { width: 120 },
      },
      {
        dataKey: 'protein',
        label: 'Protein',
        filterType: FILTER_TYPES.RADIO,
        renderFilter: () => <ProteinFilterComponent />,
        renderCell: PercentValueComponent('protein'),
        gridColDefProps: { width: 120 },
      },
      {
        dataKey: 'isYummy',
        label: 'Is Yummy',
        filterType: FILTER_TYPES.BOOLEAN,
        renderFilter: () => <IsYummyFilterComponent />,
        renderCell: (rowData: any, rowDataIndex: number) => {
          return rowData['isYummy'] ? <BasicAllow fontSize="small" /> : undefined
        },
        gridColDefProps: { width: 120 },
      },
      {
        dataKey: 'dateModified',
        label: 'Date Modified',
        filterType: FILTER_TYPES.DATE_PICKER,
        renderFilter: () => <DateModifiedFilterComponent />,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const dateModified = rowData['dateModified']
          return dateModified ? dateModified.toDateString() : undefined
        },
      },
      {
        dataKey: 'dateCreated',
        label: 'Date Created',
        filterType: FILTER_TYPES.DATE_RANGE,
        renderFilter: () => <DateCreatedFilterComponent />,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const dateCreated = rowData['dateCreated']
          return dateCreated ? dateCreated.toDateString() : undefined
        },
      },
      {
        dataKey: 'lastEaten',
        label: 'Last Eaten',
        filterType: FILTER_TYPES.DATETIME_RANGE,
        renderFilter: () => <LastEatenFilterComponent />,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const lastEaten = rowData['lastEaten']
          return lastEaten ? lastEaten.toISOString() : undefined
        },
      },
    ],
    [],
  )

export const useStorybookTable = ({ columns, onRowClick }) => {
  const mounted = React.useRef(true)

  const [loadedRows, setLoadedRows] = useState<any>([])
  const [startIndex, setStartIndex] = useState<number>(0)

  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const [loadingMore, setLoadingMore] = useState(false)

  const sortingProps = useSort(null, TableSortDirection.Asc)
  const { sort, sortDirection } = sortingProps

  const { data, loading, error, fetchMore } = useStatefulAsyncQuery<{ elements: any[]; total: number }, any>(
    fetchXGridData as AsyncQuery<{ elements: any[]; total: number }, any>,
    {
      variables: {
        startIndex: 0,
        stopIndex: 30,
        sortBy: sort,
        sortDir: sortDirection as TableSortDirection,
        filters: filterProps.activeFilters,
        columns,
      },
    },
  )

  const idFunction = row => row.id

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns, title: 'Table columns', tableName: 'xgrid-storybook' })
  const { onLoadedSelect, countSelected, ...selectionProps } = useServerSideSelection({ idFunction })

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} tableCell={false} />,
      idFunction,
      loading,
      onRowClick,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, loading, onRowClick],
  )

  const onLoadMoreRows = async ({ startIndex, stopIndex }) => {
    setLoadingMore(true)
    const { elements: moreData } = (await fetchMore({
      startIndex,
      stopIndex,
      sortBy: sort,
      sortDir: sortDirection as TableSortDirection,
      filters: filterProps.activeFilters,
      columns,
    })) as { elements: any[] }
    console.log(`On load more rows`)
    onLoadedSelect(moreData as unknown[])
    if (moreData && mounted) setLoadedRows(loadedRows.concat(moreData))
    setLoadingMore(false)
  }

  useEffect(() => {
    const startIndex = data?.elements ? data.elements.length : 0
    const loadedRowsLength = loadedRows.length
    setStartIndex(startIndex + loadedRowsLength)
    console.log(`set start index ${startIndex}`)
  }, [loadedRows, data])

  const handleOnRowsScrollEnd = params => {
    const fetchCount = params.viewportPageSize
    // The custom fetchCount results in empty space at the bottom of the grid
    // const fetchCount = 20
    if (loadedRows.length <= MAX_ROW_LENGTH) {
      const variables = { startIndex: startIndex, stopIndex: startIndex + fetchCount }
      if (variables.startIndex !== variables.stopIndex) onLoadMoreRows({ ...variables })
    }
  }

  useEffect(() => {
    // mock data only
    setLoadedRows([])
    setStartIndex(0)
    onLoadedSelect(data?.elements ? data?.elements : [], true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  return {
    providerProps: {
      basicProps,
      filterProps,
      selectedProps: selectionProps,
      sortingProps: sortingProps,
      filterLabelProps,
    },
    tableProps: {
      rows: (data?.elements ? data?.elements : []).concat(loadedRows),
      loading: loading || loadingMore,
      onRowsScrollEnd: handleOnRowsScrollEnd,
      checkboxSelection: true,
      tableName: 'xgrid-with-drawer-storybook',
    },
    selectedCount: countSelected(data?.total) ?? 0,
    totalRows: data?.total ?? 0,
  }
}
