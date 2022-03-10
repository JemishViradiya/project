import type { Moment } from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Card, makeStyles } from '@material-ui/core'

import type { ExportActionResult } from '@ues-behaviour/export'
import { ExportAction, exportFileName } from '@ues-behaviour/export'
import { useExportAsyncQuery } from '@ues-data/export'
import { MockProvider, useStatefulAsyncQuery } from '@ues-data/shared'
import { BasicAllow } from '@ues/assets'
import type { CustomFilter, SimpleFilter, TableColumn, TableSortDirection } from '@ues/behaviours'
import {
  AppliedFilterPanel,
  AutocompleteSearchFilter,
  BooleanFilter,
  CheckboxFilter,
  ColumnPicker,
  DatePickerFilter,
  DateRangeFilter,
  DatetimeRangeFilter,
  FILTER_TYPES,
  InfiniteTable,
  InfiniteTableProvider,
  NumericFilter,
  NumericFilterUnits,
  NumericRangeFilter,
  OPERATOR_VALUES,
  RadioFilter,
  STRING_OPERATORS,
  TableToolbar,
  useAutocompleteSearchFilter,
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
  useRadioFilter,
  useSelected,
  useSort,
  useTableFilter,
} from '@ues/behaviours'

import { useServiceWorkerDecorator } from '../utils'
import { getAutocomplete, getFatValueItems, getMockData, getProteinValueItems } from './table.data'
import type { InfiniteTableItem, InfiniteTableResponse } from './table.utils'
import { fetchInfiniteData, fetchInfiniteExportData } from './table.utils'

interface ExportItem {
  [key: string]: string
}

const ROW_DATA = getMockData()
const FETCH_BATCH_SIZE = 30
const EXPORT_BATCH_SIZE = FETCH_BATCH_SIZE

// Define outside the component
const idFunction = row => row.id

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
}))

const IsYummyFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<boolean>>()
  const props = useBooleanFilter({ filterProps, key: 'isYummy' })
  return <BooleanFilter label="Is Yummy" optionLabel="Option" {...props} />
}

const FatFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<any[]>>()
  const props = useCheckboxFilter({ filterProps, key: 'fat' })
  return <CheckboxFilter label="Fat" items={getFatValueItems()} {...props} />
}

const ProteinFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<number>>()
  const props = useRadioFilter({ filterProps, key: 'protein' })
  return <RadioFilter label="Protein" items={getProteinValueItems()} {...props} />
}

const CaloriesFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<number>>()
  const props = useNumericFilter({ filterProps, key: 'calories' })
  return <NumericFilter label="Calories" min={0} max={200} {...props} />
}

const CarbsFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<[number, number]>>()
  const props = useNumericRangeFilter({ filterProps, key: 'carbs', min: 0, max: 100, unit: NumericFilterUnits.Gram })
  return <NumericRangeFilter label="Carbs" min={0} max={100} {...props} />
}

const NameFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const [options, setOptions] = useState([])

  const getOptions = useCallback(value => {
    const suggest = value ? getAutocomplete(value) : []
    setOptions(suggest)
  }, [])

  const clearOptions = useCallback(() => {
    setOptions([])
  }, [])

  const props = useAutocompleteSearchFilter({
    filterProps,
    key: 'name',
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    options,
    getOptions,
    clearOptions,
  })
  return <AutocompleteSearchFilter label="Dessert" operators={STRING_OPERATORS} {...props} />
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

const getDateModifiedValue = rowData => {
  const dateModified = rowData['dateModified']
  return dateModified ? dateModified.toDateString() : undefined
}
const getDateCreatedValue = rowData => {
  const dateCreated = rowData['dateCreated']
  return dateCreated ? dateCreated.toDateString() : undefined
}
const getLastEatenValue = rowData => {
  const lastEaten = rowData['lastEaten']
  return lastEaten ? lastEaten.toISOString() : undefined
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const FilterInfiniteTable = ({ sorting, selection, columnPicker, ...args }) => {
  const classes = useStyles()
  const { t: unused } = useTranslation('general/form') // 'form' is required for Export dialog to not have view "blink"/reload during loading 'form' namespace

  const columns = useMemo(
    (): TableColumn<InfiniteTableItem>[] => [
      {
        dataKey: 'name',
        label: 'Dessert (100g serving)',
        persistent: true,
        width: 400,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <NameFilterComponent />,
      },
      {
        dataKey: 'calories',
        label: 'Calories',
        width: 180,
        show: false,
        filterType: FILTER_TYPES.NUMERIC,
        renderFilter: () => <CaloriesFilterComponent />,
      },
      {
        dataKey: 'fat',
        label: 'Fat (g)',
        width: 180,
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <FatFilterComponent />,
      },
      {
        dataKey: 'carbs',
        label: 'Carbs (g)',
        width: 180,
        filterType: FILTER_TYPES.NUMERIC_RANGE,
        renderFilter: () => <CarbsFilterComponent />,
      },
      {
        dataKey: 'protein',
        label: 'Protein (g)',
        width: 180,
        filterType: FILTER_TYPES.RADIO,
        renderFilter: () => <ProteinFilterComponent />,
      },
      {
        dataKey: 'isYummy',
        label: 'Is Yummy',
        width: 180,
        filterType: FILTER_TYPES.BOOLEAN,
        renderCell: rowData => {
          return rowData['isYummy'] ? <BasicAllow fontSize="small" /> : undefined
        },
        exportValue: rowData => (rowData['isYummy'] ? 'Yes' : 'No'),
      },
      {
        dataKey: 'dateModified',
        label: 'Date Modified',
        width: 200,
        show: false,
        filterType: FILTER_TYPES.DATE_PICKER,
        renderFilter: () => <DateModifiedFilterComponent />,
        renderCell: rowData => getDateModifiedValue(rowData),
        exportValue: rowData => getDateModifiedValue(rowData),
      },
      {
        dataKey: 'dateCreated',
        label: 'Date Created',
        width: 200,
        show: false,
        filterType: FILTER_TYPES.DATE_RANGE,
        renderFilter: () => <DateCreatedFilterComponent />,
        renderCell: rowData => getDateCreatedValue(rowData),
        exportValue: rowData => getDateCreatedValue(rowData),
      },
      {
        dataKey: 'lastEaten',
        label: 'Last Eaten',
        width: 210,
        show: false,
        filterType: FILTER_TYPES.DATETIME_RANGE,
        renderFilter: () => <LastEatenFilterComponent />,
        renderCell: rowData => getLastEatenValue(rowData),
        exportValue: rowData => getLastEatenValue(rowData),
      },
    ],
    [],
  )

  const sortProps = useSort(null, 'asc')
  const { sort, sortDirection } = sortProps

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: columns, title: 'Table columns' })
  const selectionProps = useSelected('id')

  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const { data, loading, error, fetchMore } = useStatefulAsyncQuery(fetchInfiniteData, {
    variables: {
      startIndex: 0,
      stopIndex: FETCH_BATCH_SIZE,
      sortBy: sort,
      sortDir: sortDirection as TableSortDirection,
      filters: filterProps.activeFilters,
      columns: columns,
    },
  })

  const exportVariables = useMemo(
    () => ({
      startIndex: 0,
      stopIndex: EXPORT_BATCH_SIZE,
      batchSize: EXPORT_BATCH_SIZE,
      columns: columns,
      // exported data should be sorted by default (useSort(null, 'asc') in this case)
    }),
    [columns],
  )

  const [collectedData, setCollected] = useState([]) // only to make it work with mock data, use pure data-layer instead

  const onLoadMoreRows = useCallback(
    async ({ startIndex, stopIndex }) => {
      const moreData = (await fetchMore({
        startIndex,
        stopIndex,
        sortBy: sort,
        sortDir: sortDirection as TableSortDirection,
        filters: filterProps.activeFilters,
        columns: columns,
      })) as InfiniteTableResponse
      if (moreData) setCollected([...collectedData, ...moreData.elements])
    },
    [fetchMore, collectedData, columns, filterProps.activeFilters, sort, sortDirection],
  )

  useEffect(() => {
    setCollected([]) // reset collected data
  }, [data])

  const result = useMemo(() => {
    if (data) {
      return [...data?.elements, ...collectedData]
    }
  }, [data, collectedData])

  const infinitLoader = useMemo(
    () => ({
      rowCount: ROW_DATA.length,
      isRowLoaded: (prop: { index: number }) => result[prop.index] !== undefined ?? false,
      loadMoreRows: onLoadMoreRows,
      threshold: 10,
      minimumBatchSize: FETCH_BATCH_SIZE,
    }),
    [result, onLoadMoreRows],
  )

  const basicProps = useMemo(
    () => ({
      columns: columnPicker ? displayedColumns : columns,
      columnPicker: props => (columnPicker ? <ColumnPicker {...columnPickerProps} {...props} /> : undefined),
      idFunction,
      loading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps],
  )

  const exportSource = useExportAsyncQuery(fetchInfiniteExportData)
  const exportAction = useCallback(
    async (opts): ExportActionResult<ExportItem> => ({
      source: await exportSource({
        variables: opts.filtered ? { ...exportVariables, filters: filterProps.activeFilters } : exportVariables,
        selector: items =>
          items?.elements?.map((event, index) => {
            const exportItem = {} as ExportItem
            for (const column of columns) {
              exportItem[column.label] = column.exportValue ? column.exportValue(event, index) : event[column.dataKey]
            }
            return exportItem
          }),
      }),
      fileName: exportFileName('SimpleInfiniteWithExport', opts),
    }),
    [columns, exportSource, exportVariables, filterProps.activeFilters],
  )

  return (
    <Box display="flex" flexDirection="column" height="90vh">
      <Card className={classes.container}>
        <TableToolbar
          bottom={<AppliedFilterPanel {...filterProps} {...filterLabelProps} />}
          end={<ExportAction exportAction={exportAction} />}
        />
        <InfiniteTableProvider
          basicProps={basicProps}
          selectedProps={selection ? selectionProps : undefined}
          sortingProps={sorting ? sortProps : undefined}
          data={result ?? []}
          filterProps={filterProps}
        >
          <InfiniteTable infinitLoader={infinitLoader} noDataPlaceholder="No data" />
        </InfiniteTableProvider>
      </Card>
    </Box>
  )
}

export const FilterInfiniteWithExport = FilterInfiniteTable.bind({})

FilterInfiniteWithExport.decorators = [
  Story =>
    useServiceWorkerDecorator(
      <MockProvider value={true}>
        <Story />
      </MockProvider>,
    ),
]

FilterInfiniteWithExport.parameters = {
  docs: {
    source: {
      code: FilterInfiniteWithExport.toString(),
    },
  },
}

FilterInfiniteWithExport.args = {
  selection: true,
  columnPicker: true,
  quickSearchFilterRequiresThreeCharacters: false,
}
