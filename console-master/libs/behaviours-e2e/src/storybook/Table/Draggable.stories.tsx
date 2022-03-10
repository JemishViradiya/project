/* eslint-disable @typescript-eslint/no-empty-function */
// dependencies
import React, { useMemo, useState } from 'react'

import { Box, Button, Typography } from '@material-ui/core'
// components
import Card from '@material-ui/core/Card'

import { MockProvider, useStatefulAsyncQuery } from '@ues-data/shared'
import { BasicAllow } from '@ues/assets'
import type { TableSortDirection } from '@ues/behaviours'
import {
  ColumnPicker,
  DraggableTable,
  DraggableTableProvider,
  TableToolbar,
  useColumnPicker,
  useDraggableTable,
  useSelected,
  useSort,
} from '@ues/behaviours'

import markdown from './draggable.md'
import { getMockData } from './table.data'
import { fetchPageData } from './table.utils'
// constants
const ROW_DATA = getMockData()

const ActionsPanel = ({ selectionProps, resetDrag, setDraggable, mode }) => {
  return (
    <>
      {selectionProps && selectionProps.selected.length > 0 && (
        <Button color="primary" variant="contained">
          Primary action
        </Button>
      )}
      <Button color="primary" variant="contained" onClick={() => setDraggable(!mode)}>
        Set draggable
      </Button>
      {mode && (
        <Button color="primary" variant="contained" onClick={() => resetDrag()}>
          Reset drag
        </Button>
      )}
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

const DraggableTableStory = ({ sorting, selection, expandable, columnPicker, ...args }) => {
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
        icon: true,
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

  const [draggableMode, setDraggable] = useState(false)

  const sortProps = useSort(null, 'asc')
  const { sort, sortDirection } = sortProps

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: COLUMNS, title: 'Table columns' })
  const selectionProps = useSelected('id')

  const expandableProps = {
    isRowExpandable: () => true,
    renderExpandableRow: row => (
      <Box m={1}>
        <Typography variant="body2">{row.name} expandable row</Typography>
      </Box>
    ),
  }

  const { data: initialData, loading, error, fetchMore } = useStatefulAsyncQuery<any[], any>(fetchPageData, {
    variables: {
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

  const draggable = draggableMode
    ? {
        onDragChange: ({ updatedDataSource }) => {
          /* empty for now */
        },
        onDataReorder: (rowData, index) => ({ ...rowData, rank: index + 1 }),
      }
    : undefined
  const { data, draggableProps, resetDrag } = useDraggableTable({ initialData, idFunction, draggable })

  return (
    <Card style={{ height: '90vh', overflow: 'auto' }}>
      <TableToolbar
        begin={
          <ActionsPanel selectionProps={selectionProps} resetDrag={resetDrag} setDraggable={setDraggable} mode={draggableMode} />
        }
      />
      <DraggableTableProvider
        basicProps={basicProps}
        sortingProps={sortProps}
        selectedProps={selection ? selectionProps : undefined}
        expandableProps={expandable ? expandableProps : undefined}
        draggableProps={draggableProps}
      >
        <DraggableTable data={data ?? []} noDataPlaceholder="No data" />
      </DraggableTableProvider>
    </Card>
  )
}

export const Draggable = DraggableTableStory.bind({})

const decorator = Story => (
  <MockProvider value={true}>
    <Story />
  </MockProvider>
)

Draggable.args = {
  expandable: true,
  selection: true,
  sorting: true,
  columnPicker: true,
}
Draggable.decorators = [decorator]
Draggable.parameters = { notes: markdown }
