/* eslint-disable @typescript-eslint/no-empty-function */
// dependencies
import React, { useMemo } from 'react'

import { Button } from '@material-ui/core'
// components
import Card from '@material-ui/core/Card'

import { MockProvider, useStatefulAsyncQuery } from '@ues-data/shared'
import { BasicAdd, BasicAllow, BasicDelete } from '@ues/assets'
import type { TableSortDirection } from '@ues/behaviours'
import {
  BasicTable,
  ColumnPicker,
  Loading,
  StandardPagination,
  TableProvider,
  TableToolbar,
  useColumnPicker,
  usePagination,
  useSelected,
  useSort,
} from '@ues/behaviours'

import markdown from './simple.md'
import { getMockData } from './table.data'
import { fetchPageData } from './table.utils'
// constants
const ROW_DATA = getMockData()

const ActionsPanel = ({ selectionProps }) => {
  return (
    <>
      <Button startIcon={<BasicAdd />} color="secondary" variant="contained">
        Additive action
      </Button>
      {selectionProps && selectionProps.selected.length > 0 && (
        <Button color="primary" variant="contained">
          Primary action
        </Button>
      )}
      {selectionProps && selectionProps.selected.length > 0 && (
        <Button startIcon={<BasicDelete />} color="primary" variant="contained">
          Delete action
        </Button>
      )}{' '}
    </>
  )
}

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

const SimpleTable = ({ sorting, selection, pagination, columnPicker, ...args }) => {
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
        show: false,
        sortable: sorting,
      },
      {
        dataKey: ColumnKey.FAT,
        label: 'Fat (g)',
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
        sortable: sorting,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const dateModified = rowData[ColumnKey.DATE_MODIFIED]
          return dateModified ? dateModified.toDateString() : undefined
        },
      },
      {
        dataKey: ColumnKey.DATE_CREATED,
        label: 'Date Created',
        show: false,
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
        show: false,
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
    [displayedColumns, columnPickerProps],
  )

  return (
    <Card>
      <TableToolbar begin={<ActionsPanel selectionProps={selectionProps} />} />
      <TableProvider basicProps={basicProps} sortingProps={sortProps} selectedProps={selection ? selectionProps : undefined}>
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

export const Simple = SimpleTable.bind({})

const decorator = Story => (
  <MockProvider value={true}>
    <Story />
  </MockProvider>
)

Simple.args = {
  pagination: true,
  selection: true,
  sorting: true,
  columnPicker: true,
}
Simple.decorators = [decorator]
Simple.parameters = { notes: markdown }
