import { memoize as _memoize } from 'lodash-es'
import type { ReactElement } from 'react'
import React, { memo } from 'react'

import { Box, makeStyles, TableSortLabel, Typography } from '@material-ui/core'
import type { GridColDef, GridColumnHeaderParams } from '@material-ui/x-grid'
import { GridColumnHeaderTitle } from '@material-ui/x-grid'

import { boxFlexBetweenProps, makeTextCellStyles } from '@ues/assets'
import type { TableColumn, TableSortDirection } from '@ues/behaviours'
import { useTableSort } from '@ues/behaviours'

import type { ColumnsWidthConfig } from './column-resize'

/**
 * Default width in px
 */
const DEFAULT_WIDTH = 150
const DEFAULT_MIN_WIDTH = 140

const resolveColumnHeader = (column: TableColumn, currentWidth: number) =>
  column.renderLabel ? column.renderLabel() : <GridColumnHeaderTitle columnWidth={currentWidth} label={column.label} />

const HeaderCell = memo(
  ({
    column,
    columnIndex,
    gridHeaderParams,
  }: {
    column: TableColumn
    columnIndex: number
    gridHeaderParams: GridColumnHeaderParams
  }) => {
    const sortingProps = useTableSort()

    return (
      <Box {...boxFlexBetweenProps} maxWidth="100%" width="100%" key={columnIndex}>
        {sortingProps && (column.sortable || column.clientSortable) ? (
          <TableSortLabel
            onClick={() => sortingProps.onSort(column.dataKey)}
            active={sortingProps.sort === column.dataKey}
            direction={sortingProps.sort === column.dataKey ? (sortingProps.sortDirection as TableSortDirection) : undefined}
          >
            {resolveColumnHeader(column, gridHeaderParams.colDef.width)}
          </TableSortLabel>
        ) : (
          resolveColumnHeader(column, gridHeaderParams.colDef.width)
        )}
        {column.renderFilter !== undefined && column.renderFilter()}
      </Box>
    )
  },
)

const useEnhancedCellStyles = makeStyles({
  ellipsisTextCell: {
    '&, & *': {
      ...makeTextCellStyles().ellipsisTextCell,
    },
  },
})

const EnhancedCell: React.FC = memo(({ children }) => {
  const { ellipsisTextCell } = useEnhancedCellStyles()

  const containerProps = { className: ellipsisTextCell }

  return typeof children === 'string' ? (
    <Typography {...containerProps}>{children}</Typography>
  ) : (
    <Box {...containerProps}>{children}</Box>
  )
})

const makeEnhancedCellRender = (column: TableColumn): Partial<TableColumn> =>
  column.text === true
    ? {
        valueGetter: undefined,
        renderCell: params => {
          const element = column.valueGetter
            ? column.valueGetter(params)
            : column.renderCell
            ? column.renderCell(params.row, params.rowIndex)
            : params.row?.[column.dataKey]

          return <EnhancedCell>{element}</EnhancedCell>
        },
      }
    : {
        valueGetter: column.valueGetter ? column.valueGetter : undefined,
        renderCell: column.renderCell
          ? params => (<React.Fragment>{column.renderCell(params.row, params.rowIndex)}</React.Fragment>) as ReactElement
          : undefined,
      }

/**
 * Transforms column definition from TableColumn to MUI XGrid GridColDef.
 *
 * @param columns {TableColumn} columns
 *
 * @returns {GridColDef[]} the transformed columns
 */
const transformColumns = ({ columns, columnsWidth }: { columns: TableColumn[]; columnsWidth: ColumnsWidthConfig }) => {
  const transform = _memoize(({ c, index, savedWidth }: { c: TableColumn; index: number; savedWidth?: number }) => {
    return {
      field: c.dataKey,
      headerName: c.label,
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: params => (<HeaderCell column={c} columnIndex={index} gridHeaderParams={params} />) as ReactElement,
      hide: c.show ? !c.show : false,
      cellClassName: c.styles ?? '',
      ...c.gridColDefProps,
      flex: savedWidth || c.gridColDefProps?.width ? undefined : c.gridColDefProps?.flex || 1,
      width: savedWidth || c.gridColDefProps?.width || DEFAULT_WIDTH,
      minWidth: c.gridColDefProps?.minWidth || DEFAULT_MIN_WIDTH,
      ...makeEnhancedCellRender(c),
    }
  })

  return columns.map((c: TableColumn, index: number) =>
    transform({ c, index, savedWidth: columnsWidth ? columnsWidth[c.dataKey] : undefined }),
  ) as GridColDef[]
}

export { transformColumns }
