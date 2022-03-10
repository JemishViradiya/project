// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Checkbox,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@material-ui/core'

import { boxFlexBetweenProps } from '@ues/assets'

import { LoadingTable } from '../loading'
import type { DraggableTableProps, TableColumn, TableSortDirection as TableSortDirectionTypes } from '../types'
import { TableSortDirection, useBasicTable, useTableExpandable, useTableSelection, useTableSort } from '../types'
import { useDraggableTableProps } from './context'
import Row from './row'

const COULUMN_HEADER_RESOLVER = (column: TableColumn): any => (column.renderLabel ? column.renderLabel() : column.label)

const ActionCell = ({ data }) => {
  const selectionProps = useTableSelection()
  const expandable = useTableExpandable()
  const draggable = useDraggableTableProps()
  const selectAll = useCallback(e => selectionProps.onSelectAll(e, data), [selectionProps, data])
  const { t } = useTranslation(['tables'])

  if (draggable) {
    return <TableCell padding="checkbox" />
  } else {
    return (
      <>
        {expandable && <TableCell padding="checkbox" />}
        {selectionProps && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={selectionProps.isSomeSelected(data)}
              inputProps={{ 'aria-label': t('selectAll') }}
              checked={selectionProps.isAllSelected(data)}
              onChange={selectAll}
              size="small"
            />
          </TableCell>
        )}
      </>
    )
  }
}

const HeaderColumns = memo(
  ({
    resolveColumnHeader,
    draggableEnabled,
    rankMode,
  }: Pick<DraggableTableProps, 'resolveColumnHeader' | 'draggableEnabled' | 'rankMode'>) => {
    const { columns } = useBasicTable()
    const sortingProps = useTableSort()

    useEffect(() => {
      if (draggableEnabled && rankMode) {
        sortingProps.setSort('rank')
        sortingProps.setSortDirection(TableSortDirection.Asc)
      }
    }, [draggableEnabled, sortingProps, rankMode])

    return (
      <>
        {columns.map((col, index) => (
          <TableCell
            key={index}
            align={col.align ?? 'left'}
            sortDirection={
              sortingProps && sortingProps.sort === col.dataKey
                ? (sortingProps.sortDirection as TableSortDirectionTypes)
                : undefined
            }
            style={{ minWidth: col.width }}
          >
            <Box {...boxFlexBetweenProps}>
              {sortingProps && (col.sortable || col.clientSortable) ? (
                <TableSortLabel
                  disabled={draggableEnabled}
                  onClick={() => sortingProps.onSort(col.dataKey)}
                  active={sortingProps.sort === col.dataKey}
                  direction={
                    sortingProps.sort === col.dataKey ? (sortingProps.sortDirection as TableSortDirectionTypes) : undefined
                  }
                >
                  {resolveColumnHeader(col)}
                </TableSortLabel>
              ) : (
                resolveColumnHeader(col)
              )}
              {col.renderFilter !== undefined && col.renderFilter()}
            </Box>
          </TableCell>
        ))}
      </>
    )
  },
)

const DraggableTable: React.FC<DraggableTableProps> = ({
  data,
  rankMode,
  noDataPlaceholder,
  resolveColumnHeader = COULUMN_HEADER_RESOLVER,
  TableProps = {},
}) => {
  const draggableProps = useDraggableTableProps()
  const draggableComponent = draggableProps ? { component: draggableProps.component } : undefined
  const { columnPicker, embedded } = useBasicTable()
  const picker = useMemo(() => columnPicker && columnPicker({}), [columnPicker])

  return (
    <TableContainer>
      <MuiTable size={embedded ? 'small' : 'medium'} {...TableProps}>
        <TableHead>
          <TableRow>
            <ActionCell data={data} />
            <HeaderColumns resolveColumnHeader={resolveColumnHeader} draggableEnabled={!!draggableProps} rankMode={rankMode} />
            {picker}
          </TableRow>
          <LoadingTable />
        </TableHead>
        {!isEmpty(data) && (
          <TableBody {...draggableComponent}>
            {data.map((rowData, index) => (
              <Row key={index} rowData={rowData} rowDataIndex={index} />
            ))}
          </TableBody>
        )}
      </MuiTable>
      {isEmpty(data) && (
        <Box p={3} textAlign="center">
          <Typography variant="body2">{noDataPlaceholder}</Typography>
        </Box>
      )}
    </TableContainer>
  )
}

export default DraggableTable
