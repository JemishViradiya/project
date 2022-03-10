import type { Moment } from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Button, Typography } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import { MockProvider, useStatefulAsyncQuery } from '@ues-data/shared'
import { BasicAllow } from '@ues/assets'
import type { CustomFilter, SimpleFilter, TableColumn } from '@ues/behaviours'
import {
  AppliedFilterPanel,
  BooleanFilter,
  CheckboxFilter,
  ColumnPicker,
  ContentAreaPanel,
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
  TableProvider,
  TableSortDirection,
  TableToolbar,
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

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getFatItemsLocalization,
  getFatValueItems,
  getProteinItemsLocalization,
  getProteinValueItems,
} from '../../../../behaviours-e2e/src/storybook/Table/table.data'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { fetchXGridData } from '../../../../behaviours-e2e/src/storybook/Table/table.utils'
import markdown from './x-grid.md'

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

const PercentValueComponent = dataKey => rowData => `${rowData[dataKey]}%`

const useStorybookTable = ({ columns, colPicker, sorting, selection }) => {
  const mounted = React.useRef(true)

  const [loadedRows, setLoadedRows] = useState<any>([])
  const [startIndex, setStartIndex] = useState<number>(0)

  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const [loadingMore, setLoadingMore] = useState(false)

  const sortingProps = useSort(null, TableSortDirection.Asc)
  const { sort, sortDirection } = sortingProps

  const { data, loading, error, fetchMore } = useStatefulAsyncQuery<{ elements: any[]; total: number }, any>(fetchXGridData, {
    variables: {
      startIndex: 0,
      stopIndex: 30,
      sortBy: sort,
      sortDir: sortDirection as TableSortDirection,
      filters: filterProps.activeFilters,
      columns,
    },
  })

  const idFunction = row => row.id

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns, title: 'Table columns', tableName: 'xgrid-storybook' })
  const { onLoadedSelect, countSelected, ...selectionProps } = useServerSideSelection({ idFunction })
  // const selectionProps = useSelected('id') simploe selection

  const basicProps = useMemo(
    () => ({
      columns: colPicker ? displayedColumns : columns,
      columnPicker: props => (colPicker ? <ColumnPicker {...columnPickerProps} {...props} tableCell={false} /> : undefined),
      idFunction,
      loading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colPicker, displayedColumns, loading],
  )
  if (!colPicker) delete basicProps['columnPicker']

  const onLoadMoreRows = async ({ startIndex, stopIndex }) => {
    setLoadingMore(true)
    const { elements: moreData } = await fetchMore({
      startIndex,
      stopIndex,
      sortBy: sort,
      sortDir: sortDirection as TableSortDirection,
      filters: filterProps.activeFilters,
      columns,
    })
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
      selectedProps: selection ? selectionProps : undefined,
      sortingProps: sorting ? sortingProps : undefined,
      filterLabelProps,
    },
    tableProps: {
      rows: (data?.elements ? data?.elements : []).concat(loadedRows),
      loading: loading || loadingMore,
      onRowsScrollEnd: handleOnRowsScrollEnd,
      checkboxSelection: selection,
      tableName: 'xgrid-storybook',
    },
    selectedCount: countSelected(data?.total) ?? 0,
    totalRows: data?.total ?? 0,
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const Table = ({ sorting, selection, colPicker, dense, ...args }) => {
  const COLUMNS: TableColumn[] = useMemo(
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

  const wrapperStyle = useMemo(() => ({ height: window.innerHeight - 150, width: '100%' }), [])

  const { providerProps, selectedCount, totalRows, tableProps } = useStorybookTable({
    columns: COLUMNS,
    colPicker,
    sorting,
    selection,
  })

  return (
    <ContentAreaPanel fullWidth>
      <TableProvider {...providerProps}>
        <TableToolbar
          bottom={<AppliedFilterPanel {...providerProps.filterProps} {...providerProps.filterLabelProps} />}
          begin={
            selection &&
            selectedCount > 0 && (
              <>
                <Typography>Selected: {selectedCount} </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => alert(JSON.stringify(providerProps?.selectedProps?.selectionModel))}
                >
                  Show selected
                </Button>
              </>
            )
          }
          end={<Typography>Total rows: {totalRows} </Typography>}
        />
        <XGrid wrapperStyle={wrapperStyle} dense={dense} {...tableProps} />
      </TableProvider>
    </ContentAreaPanel>
  )
}

const decorator = Story => (
  <MockProvider value={true}>
    <Story />
  </MockProvider>
)

Table.decorators = [decorator]

Table.args = {
  sorting: true,
  selection: true,
  colPicker: true,
  dense: false,
}

Table.argTypes = {
  sorting: {
    control: 'boolean',
    defaultValue: {
      summary: false,
    },
    description: 'Sorting enabled',
  },
  selection: {
    control: 'boolean',
    defaultValue: {
      summary: false,
    },
    description: 'Selection enabled',
  },
  colPicker: {
    control: 'boolean',
    defaultValue: {
      summary: false,
    },
    description: 'Column picker enabled',
  },
  dense: {
    control: 'boolean',
    defaultValue: {
      summary: false,
    },
    description: 'Dense grid enabled',
  },
}

Table.parameters = {
  notes: markdown,
}

export default {
  title: 'Table/MUI X-Grid',
}
