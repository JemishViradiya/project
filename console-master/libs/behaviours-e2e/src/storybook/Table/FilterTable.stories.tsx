// dependencies
import type { Moment } from 'moment'
import React, { useMemo } from 'react'

// components
import Card from '@material-ui/core/Card'

import { BasicAllow } from '@ues/assets'
import type { CustomFilter, SimpleFilter } from '@ues/behaviours'
import {
  AppliedFilterPanel,
  BasicTable,
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
  TableProvider,
  TableToolbar,
  useBooleanFilter,
  useCheckboxFilter,
  useClientFilter,
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
  useSelected,
  useTableFilter,
} from '@ues/behaviours'

import {
  getFatItemsLocalization,
  getFatValueItems,
  getMockData,
  getProteinItemsLocalization,
  getProteinValueItems,
} from './table.data'
import markdown from './withFilters.md'

// constants
const ROW_DATA = getMockData()
// Define outside the component
enum ColumnKey {
  NAME = 'name',
  CALORIES = 'calories',
  FAT = 'fat',
  CARBS = 'carbs',
  PROTEIN = 'protein',
  IS_YUMMY = 'isYummy',
  DATE_MODIFIED = 'dateModified',
  DATE_CREATED = 'dateCreated',
  LAST_EATEN = 'lastEaten',
}
const idFunction = row => row.id
const columnIdentifier = ColumnKey.NAME

const PercentValueComponent = dataKey => rowData => `${rowData[dataKey]}%`

const FilterTable = ({ selection, pagination, columnPicker, quickSearchFilterRequiresThreeCharacters, ...args }) => {
  const IsYummyFilterComponent = () => {
    const filterProps = useTableFilter<SimpleFilter<boolean>>()
    const props = useBooleanFilter({ filterProps, key: ColumnKey.IS_YUMMY })
    return <BooleanFilter label="Is Yummy" optionLabel="Option" {...props} />
  }

  const FatFilterComponent = () => {
    const filterProps = useTableFilter<SimpleFilter<number[]>>()
    const props = useCheckboxFilter({ filterProps, key: ColumnKey.FAT })
    return <CheckboxFilter label="Fat" items={getFatValueItems()} itemsLabels={getFatItemsLocalization()} {...props} />
  }

  const ProteinFilterComponent = () => {
    const filterProps = useTableFilter<SimpleFilter<number>>()
    const props = useRadioFilter({ filterProps, key: ColumnKey.PROTEIN })
    return <RadioFilter label="Protein" items={getProteinValueItems()} itemsLabels={getProteinItemsLocalization()} {...props} />
  }

  const CaloriesFilterComponent = () => {
    const filterProps = useTableFilter<SimpleFilter<number>>()
    const props = useNumericFilter({ filterProps, key: ColumnKey.CALORIES })
    return <NumericFilter label="Calories" min={0} max={200} {...props} />
  }

  const CarbsFilterComponent = () => {
    const filterProps = useTableFilter<SimpleFilter<[number, number]>>()
    const props = useNumericRangeFilter({ filterProps, key: ColumnKey.CARBS, min: 0, max: 100, unit: NumericFilterUnits.Percent })
    return <NumericRangeFilter label="Carbs" min={0} max={100} {...props} />
  }

  const NameFilterComponent = () => {
    const filterProps = useTableFilter<SimpleFilter<string>>()
    const props = useQuickSearchFilter({
      filterProps,
      key: ColumnKey.NAME,
      defaultOperator: OPERATOR_VALUES.CONTAINS,
      requireMinimumCharacters: quickSearchFilterRequiresThreeCharacters,
    })
    return (
      <QuickSearchFilter
        label="Dessert"
        requireMinimumCharacters={quickSearchFilterRequiresThreeCharacters}
        operators={STRING_OPERATORS}
        {...props}
      />
    )
  }

  const DateModifiedFilterComponent = () => {
    const filterProps = useTableFilter<SimpleFilter<Moment>>()
    const props = useDatePickerFilter({ filterProps, key: ColumnKey.DATE_MODIFIED, defaultOperator: OPERATOR_VALUES.BEFORE })
    return <DatePickerFilter label="Date Modified" {...props} />
  }

  const DateCreatedFilterComponent = () => {
    const filterProps = useTableFilter<CustomFilter<DateRangeFilter>>()
    const props = useDateRangeFilter({ filterProps, key: ColumnKey.DATE_CREATED })
    return <DateRangeFilter label="Date Created" {...props} />
  }

  const LastEatenFilterComponent = () => {
    const filterProps = useTableFilter<CustomFilter<DatetimeRangeFilter>>()
    const props = useDatetimeRangeFilter({ filterProps, key: ColumnKey.LAST_EATEN })
    return <DatetimeRangeFilter label="Last Eaten" {...props} />
  }

  const COLUMNS = useMemo(
    () => [
      {
        dataKey: ColumnKey.NAME,
        label: 'Dessert (100g serving)',
        persistent: true,
        width: 400,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <NameFilterComponent />,
      },
      {
        dataKey: ColumnKey.CALORIES,
        label: 'Calories',
        filterType: FILTER_TYPES.NUMERIC,
        renderFilter: () => <CaloriesFilterComponent />,
      },
      {
        dataKey: ColumnKey.FAT,
        label: 'Fat',
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <FatFilterComponent />,
        renderCell: PercentValueComponent('fat'),
      },
      {
        dataKey: ColumnKey.CARBS,
        label: 'Carbs',
        filterType: FILTER_TYPES.NUMERIC_RANGE,
        renderFilter: () => <CarbsFilterComponent />,
        renderCell: PercentValueComponent('carbs'),
      },
      {
        dataKey: ColumnKey.PROTEIN,
        label: 'Protein',
        filterType: FILTER_TYPES.RADIO,
        renderFilter: () => <ProteinFilterComponent />,
        renderCell: PercentValueComponent('protein'),
      },
      {
        dataKey: ColumnKey.IS_YUMMY,
        label: 'Is Yummy',
        filterType: FILTER_TYPES.BOOLEAN,
        renderFilter: () => <IsYummyFilterComponent />,
        renderCell: (rowData: any, rowDataIndex: number) => {
          return rowData[ColumnKey.IS_YUMMY] ? <BasicAllow fontSize="small" /> : undefined
        },
      },
      {
        dataKey: ColumnKey.DATE_MODIFIED,
        label: 'Date Modified',
        filterType: FILTER_TYPES.DATE_PICKER,
        renderFilter: () => <DateModifiedFilterComponent />,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const dateModified = rowData[ColumnKey.DATE_MODIFIED]
          return dateModified ? dateModified.toDateString() : undefined
        },
      },
      {
        dataKey: ColumnKey.DATE_CREATED,
        label: 'Date Created',
        filterType: FILTER_TYPES.DATE_RANGE,
        renderFilter: () => <DateCreatedFilterComponent />,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const dateCreated = rowData[ColumnKey.DATE_CREATED]
          return dateCreated ? dateCreated.toDateString() : undefined
        },
      },
      {
        dataKey: ColumnKey.LAST_EATEN,
        label: 'Last Eaten',
        width: 210,
        filterType: FILTER_TYPES.DATETIME_RANGE,
        renderFilter: () => <LastEatenFilterComponent />,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const lastEaten = rowData[ColumnKey.LAST_EATEN]
          return lastEaten ? lastEaten.toISOString() : undefined
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const FilterTableComponent = () => {
    const filterProps = useFilter({})
    const filterLabelProps = useFilterLabels(filterProps.activeFilters, COLUMNS, {
      ...getFatItemsLocalization(),
      ...getProteinItemsLocalization(),
    })
    const filteredData = useClientFilter({ data: ROW_DATA, activeFilters: filterProps.activeFilters, filterProps: COLUMNS })

    const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: COLUMNS, title: 'Table columns' })
    const selectionProps = useSelected('id')

    const basicProps = useMemo(
      () => ({
        columns: columnPicker ? displayedColumns : COLUMNS,
        columnIdentifier: columnIdentifier,
        columnPicker: columnPicker ? props => <ColumnPicker {...columnPickerProps} {...props} /> : undefined,
        idFunction,
      }),
      [displayedColumns, columnPickerProps],
    )

    return (
      <Card>
        <TableToolbar bottom={<AppliedFilterPanel {...filterProps} {...filterLabelProps} />} />
        <TableProvider basicProps={basicProps} selectedProps={selection ? selectionProps : undefined} filterProps={filterProps}>
          <BasicTable data={filteredData} noDataPlaceholder="No data" />
        </TableProvider>
      </Card>
    )
  }

  return <FilterTableComponent />
}

export const Filter = FilterTable.bind({})

Filter.args = {
  selection: true,
  columnPicker: true,
  quickSearchFilterRequiresThreeCharacters: false,
}

Filter.parameters = { notes: markdown }
