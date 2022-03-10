import React, { useMemo } from 'react'

import { Box } from '@material-ui/core'
// components
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

import { MockProvider, useStatefulAsyncQuery } from '@ues-data/shared'
import { BasicAllow } from '@ues/assets'
import type { TableSortDirection } from '@ues/behaviours'
import {
  BasicTable,
  ColumnPicker,
  Loading,
  StandardPagination,
  TableProvider,
  useColumnPicker,
  usePagination,
  useSelected,
  useSort,
} from '@ues/behaviours'

import markdown from './expansion.md'
import { getMockData } from './table.data'
import { fetchPageData } from './table.utils'
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

const ExpandableTable = ({ sorting, pagination, columnPicker, selection, ...args }) => {
  const COLUMNS = useMemo(
    () => [
      {
        dataKey: ColumnKey.NAME,
        label: 'Dessert (100g serving)',
        sortable: sorting,
        persistent: true,
        width: 400,
      },
      {
        dataKey: ColumnKey.CALORIES,
        label: 'Calories',
        sortable: sorting,
      },
      {
        dataKey: ColumnKey.FAT,
        label: 'Fat (g)',
        show: false,
        sortable: false,
      },
      {
        dataKey: ColumnKey.CARBS,
        label: 'Carbs (g)',
        show: false,
        sortable: sorting,
      },
      {
        dataKey: ColumnKey.PROTEIN,
        label: 'Protein (g)',
        show: false,
        sortable: sorting,
      },
      {
        dataKey: ColumnKey.IS_YUMMY,
        label: 'Is Yummy',
        sortable: sorting,
        renderCell: (rowData: any, rowDataIndex: number) => {
          return rowData[ColumnKey.IS_YUMMY] ? <BasicAllow fontSize="small" /> : undefined
        },
      },
      {
        dataKey: ColumnKey.DATE_MODIFIED,
        label: 'Date Modified',
        show: false,
        sortable: sorting,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const dateModified = rowData[ColumnKey.DATE_MODIFIED]
          return dateModified ? dateModified.toDateString() : undefined
        },
      },
      {
        dataKey: ColumnKey.DATE_CREATED,
        label: 'Date Created',
        sortable: sorting,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const dateCreated = rowData[ColumnKey.DATE_CREATED]
          return dateCreated ? dateCreated.toDateString() : undefined
        },
      },
      {
        dataKey: ColumnKey.LAST_EATEN,
        label: 'Last Eaten',
        sortable: sorting,
        width: 210,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const lastEaten = rowData[ColumnKey.LAST_EATEN]
          return lastEaten ? lastEaten.toISOString() : undefined
        },
      },
    ],
    [sorting],
  )

  const sortProps = useSort(null, 'asc')
  const { sort, sortDirection } = sortProps
  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: COLUMNS, title: 'Table columns' })
  const selectionProps = useSelected('id')

  const paginationProps = usePagination(1, 10)

  const expandable = {
    isRowExpandable: () => true,
    renderExpandableRow: row => (
      <Box m={1}>
        <Typography variant="body2">{row.name} expandable row</Typography>
      </Box>
    ),
  }

  const { data, loading, error, fetchMore } = useStatefulAsyncQuery<any[], any>(fetchPageData, {
    variables: {
      limit: paginationProps.rowsPerPage,
      page: pagination ? paginationProps.page : undefined,
      sortBy: sort,
      sortDir: sortDirection as TableSortDirection,
    },
  })

  const basicProps = useMemo(
    () => ({
      columns: columnPicker ? displayedColumns : COLUMNS,
      columnIdentifier: columnIdentifier,
      columnPicker: columnPicker ? props => <ColumnPicker {...columnPickerProps} {...props} /> : undefined,
      idFunction,
      loading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnPicker, displayedColumns, columnPickerProps],
  )

  return (
    <Card>
      <TableProvider
        basicProps={basicProps}
        sortingProps={sortProps}
        expandableProps={expandable}
        selectedProps={selection ? selectionProps : undefined}
      >
        <BasicTable data={data ?? []} noDataPlaceholder="No data" />
      </TableProvider>
      {pagination && (
        <StandardPagination
          total={ROW_DATA.length}
          pagesCount={Math.ceil(ROW_DATA.length / paginationProps.rowsPerPage)}
          rowsPerPageOptions={[10, 20, 30]}
          paginationProps={paginationProps}
        />
      )}
    </Card>
  )
}

export const Expandable = ExpandableTable.bind({})

Expandable.args = {
  pagination: true,
  sorting: true,
  selection: true,
  columnPicker: true,
}

const decorator = Story => (
  <MockProvider value={true}>
    <Story />
  </MockProvider>
)

Expandable.decorators = [decorator]
Expandable.parameters = { notes: markdown }
