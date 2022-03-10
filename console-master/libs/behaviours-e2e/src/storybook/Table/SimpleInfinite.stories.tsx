import React, { useCallback, useMemo, useState } from 'react'

import { Box, Button, Card, makeStyles, Typography } from '@material-ui/core'

import { MockProvider, useStatefulAsyncQuery } from '@ues-data/shared'
import { BasicAdd, BasicAllow } from '@ues/assets'
import type { TableColumn, TableSortDirection } from '@ues/behaviours'
import {
  ColumnPicker,
  InfiniteTable,
  InfiniteTableProvider,
  TableToolbar,
  useColumnPicker,
  useSelected,
  useSort,
} from '@ues/behaviours'

import { getMockData } from './table.data'
import type { InfiniteTableItem, InfiniteTableResponse } from './table.utils'
import { fetchInfiniteData } from './table.utils'

const ROW_DATA = getMockData()

const ActionsPanel = ({ selectionProps }) => {
  return (
    <>
      {selectionProps && selectionProps.selected.length > 0 && (
        <Typography variant="body2">{selectionProps.selected.length} selected</Typography>
      )}
      <Button startIcon={<BasicAdd />} color="secondary" variant="contained">
        Additive action
      </Button>
      {selectionProps && selectionProps.selected.length > 0 && (
        <Button color="primary" variant="contained">
          Primary action
        </Button>
      )}{' '}
    </>
  )
}

// Define outside the component
const idFunction = row => row.id

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
}))

const SimpleInfiniteTable = ({ sorting, selection, columnPicker, ...args }) => {
  const classes = useStyles()

  const COLUMNS = useMemo(
    (): TableColumn<InfiniteTableItem>[] => [
      {
        dataKey: 'name',
        label: 'Dessert (100g serving)',
        sortable: sorting,
        persistent: true,
        width: 500,
      },
      {
        dataKey: 'calories',
        label: 'Calories',
        show: false,
        sortable: sorting,
      },
      {
        dataKey: 'fat',
        label: 'Fat (g)',
        sortable: false,
      },
      {
        dataKey: 'carbs',
        label: 'Carbs (g)',
        show: false,
        sortable: sorting,
      },
      {
        dataKey: 'protein',
        label: 'Protein (g)',
        sortable: sorting,
      },
      {
        dataKey: 'isYummy',
        label: 'Is Yummy',
        sortable: sorting,
        renderCell: rowData => {
          return rowData['isYummy'] ? <BasicAllow fontSize="small" /> : undefined
        },
      },
      {
        dataKey: 'dateModified',
        label: 'Date Modified',
        show: false,
        sortable: sorting,
        renderCell: rowData => {
          const dateModified = rowData['dateModified']
          return dateModified ? dateModified.toDateString() : undefined
        },
      },
      {
        dataKey: 'dateCreated',
        label: 'Date Created',
        sortable: sorting,
        renderCell: rowData => {
          const dateCreated = rowData['dateCreated']
          return dateCreated ? dateCreated.toDateString() : undefined
        },
      },
      {
        dataKey: 'lastEaten',
        label: 'Last Eaten',
        sortable: sorting,
        show: false,
        width: 210,
        renderCell: rowData => {
          const lastEaten = rowData['lastEaten']
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

  const { data, loading, error, fetchMore } = useStatefulAsyncQuery(fetchInfiniteData, {
    variables: {
      startIndex: 0,
      stopIndex: 30,
      sortBy: sort,
      sortDir: sortDirection as TableSortDirection,
    },
  })

  const basicProps = useMemo(
    () => ({
      columns: columnPicker ? displayedColumns : COLUMNS,
      columnPicker: props => (columnPicker ? <ColumnPicker {...columnPickerProps} {...props} /> : undefined),
      idFunction,
      loading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps],
  )

  const [collectedData, setCollected] = useState([]) // only to make it work with mock data

  const onLoadMoreRows = useCallback(
    async ({ startIndex, stopIndex }) => {
      const moreData = (await fetchMore({
        startIndex,
        stopIndex,
        sortBy: sort,
        sortDir: sortDirection as TableSortDirection,
      })) as InfiniteTableResponse
      if (moreData) setCollected([...collectedData, ...moreData.elements])
    },
    [fetchMore, collectedData, sort, sortDirection],
  )

  const result = useMemo(() => {
    if (data) {
      return [...data.elements, ...collectedData]
    }
  }, [data, collectedData])

  const infinitLoader = useMemo(
    () => ({
      rowCount: ROW_DATA.length,
      isRowLoaded: (prop: { index: number }) => result[prop.index] !== undefined ?? false,
      loadMoreRows: onLoadMoreRows,
      threshold: 10,
      minimumBatchSize: 30,
    }),
    [result, onLoadMoreRows],
  )

  return (
    <Box display="flex" flexDirection="column" height="90vh">
      <Card className={classes.container}>
        <TableToolbar begin={<ActionsPanel selectionProps={selectionProps} />} />
        <InfiniteTableProvider
          basicProps={basicProps}
          selectedProps={selection ? selectionProps : undefined}
          sortingProps={sortProps}
          data={result ?? []}
        >
          <InfiniteTable infinitLoader={infinitLoader} noDataPlaceholder="No data" />
        </InfiniteTableProvider>
      </Card>
    </Box>
  )
}

export const SimpleInfinite = SimpleInfiniteTable.bind({})

SimpleInfinite.args = {
  selection: true,
  columnPicker: true,
  sorting: true,
}

const decorator = Story => (
  <MockProvider value={true}>
    <Story />
  </MockProvider>
)

SimpleInfinite.decorators = [decorator]
