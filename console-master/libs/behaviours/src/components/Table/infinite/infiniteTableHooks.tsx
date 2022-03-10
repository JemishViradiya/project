/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Checkbox, TableCell, TableRow, TableSortLabel } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip/Tooltip'

import { boxFlexBetweenProps } from '@ues/assets'

import { useColumnPickerStyles } from '../columnPicker'
import { LoadingTable } from '../loading'
import type { RenderingProps, TableColumn, TableSortDirection } from '../types'
import { useBasicTable, useTableSelection, useTableSort } from '../types'
import type { InfiniteTableProviderProps } from './provider'
import { useInfiniteTableStyles } from './styles'

export type InfiniteTableHookProps = {
  data: any[]
}

export type InfiniteTableReturnedHookProps = Pick<InfiniteTableProviderProps, 'renderingProps' | 'classes'>

const ROW_HEIGHT = 53

const resolveColumnHeader = (column: TableColumn) => (column.renderLabel ? column.renderLabel() : column.label)

const HeaderCell = memo(({ column, columnIndex }: { column: TableColumn; columnIndex: number }) => {
  const sortingProps = useTableSort()
  const classes = useInfiniteTableStyles()
  const { embedded } = useBasicTable()

  return (
    <TableCell
      key={columnIndex}
      component="div"
      className={clsx('MuiTableCell-head', classes.headCell, classes.flexContainer, classes.noClick)}
      style={{ height: ROW_HEIGHT }}
      align={column.align ?? 'left'}
      size={embedded ? 'small' : 'medium'}
      sortDirection={
        sortingProps && sortingProps.sort === column.dataKey ? (sortingProps.sortDirection as TableSortDirection) : undefined
      }
      aria-colindex={columnIndex}
    >
      <Box {...boxFlexBetweenProps}>
        {sortingProps && (column.sortable || column.clientSortable) ? (
          <TableSortLabel
            onClick={() => sortingProps.onSort(column.dataKey)}
            active={sortingProps.sort === column.dataKey}
            direction={sortingProps.sort === column.dataKey ? (sortingProps.sortDirection as TableSortDirection) : undefined}
          >
            {resolveColumnHeader(column)}
          </TableSortLabel>
        ) : (
          resolveColumnHeader(column)
        )}
        {column.renderFilter !== undefined && column.renderFilter()}
      </Box>
    </TableCell>
  )
})

const HeaderRow = memo(
  ({ className, columns, style, data }: { className: string; columns: TableColumn[]; style: any; data: any[] }) => {
    const classes = useInfiniteTableStyles()
    const selectionProps = useTableSelection()
    const { columnPicker, embedded } = useBasicTable()
    const { t } = useTranslation(['tables'])

    const selectAll = useCallback(e => selectionProps.onSelectAll(e, data), [selectionProps, data])
    const cellStyles = useMemo(() => ({ height: ROW_HEIGHT, width: 'auto' }), [])

    return (
      <>
        <div className={className} style={style}>
          {selectionProps && (
            <TableCell
              component="div"
              className={classes.flexContainer}
              padding="checkbox"
              style={cellStyles}
              size={embedded ? 'small' : 'medium'}
              aria-label={t('selectAll')}
            >
              <Checkbox
                indeterminate={selectionProps.isSomeSelected(data)}
                checked={selectionProps.isAllSelected(data)}
                onChange={selectAll}
                size="small"
              />
            </TableCell>
          )}
          {columns}
          {columnPicker && columnPicker({ className: clsx(classes.headCell, classes.flexContainer), component: 'div' })}
        </div>
        <LoadingTable component="div" width={style.width} />
      </>
    )
  },
)

const Row = memo(
  ({
    className,
    columns,
    style,
    rowData,
    onRowClick,
    index,
  }: {
    className: string
    columns: TableColumn[]
    style: any
    rowData: any
    onRowClick: (e: any) => void
    index: number
  }) => {
    const selectionProps = useTableSelection()
    const isSelected = selectionProps && selectionProps.isSelected(rowData)
    const { columnPicker, embedded } = useBasicTable()
    const columnPickerStyles = useColumnPickerStyles()
    const classes = useInfiniteTableStyles()
    const cellStyles = useMemo(() => ({ height: ROW_HEIGHT, width: 'auto' }), [])
    const onCheckboxClick = useCallback(
      event => {
        event.stopPropagation()
        event.preventDefault()
        selectionProps?.onSelect(rowData)
      },
      [selectionProps, rowData],
    )

    return (
      <TableRow
        key={index}
        component="div"
        className={className}
        style={style}
        onClick={onRowClick ? event => onRowClick({ event, index, rowData }) : undefined}
        selected={isSelected}
        aria-rowindex={index}
      >
        {selectionProps && (
          <TableCell
            component="div"
            className={classes.tableCell}
            padding="checkbox"
            style={cellStyles}
            size={embedded ? 'small' : 'medium'}
            aria-label={`select-${index}`}
          >
            <Checkbox onClick={onCheckboxClick} checked={isSelected} size="small" />
          </TableCell>
        )}
        {columns}
        {columnPicker && <TableCell className={columnPickerStyles.cell} style={{ height: ROW_HEIGHT }} component="div" />}
      </TableRow>
    )
  },
)

const Cell = ({ cellData, column, rowData, columnIndex }) => {
  const classes = useInfiniteTableStyles()
  const { embedded } = useBasicTable()
  const cellContent = column.renderCell ? column.renderCell(rowData) : cellData
  const rowRef = React.useRef(null)
  const showTooltip = cellContent && rowRef && rowRef.current && rowRef.current.scrollWidth > rowRef.current.clientWidth

  const tableCell = () => {
    return (
      <TableCell
        ref={rowRef}
        component="div"
        className={classes.cellContent}
        style={{ height: ROW_HEIGHT }}
        align={column.align ?? 'left'}
        size={embedded ? 'small' : 'medium'}
        aria-colindex={columnIndex}
      >
        {cellContent}
      </TableCell>
    )
  }

  if (showTooltip) {
    return (
      <Tooltip title={cellContent} placement="bottom-start" classes={{ tooltipPlacementBottom: classes.cellTooltip }}>
        {tableCell()}
      </Tooltip>
    )
  } else {
    return tableCell()
  }
}

export const useInfiniteTable = ({ data }: InfiniteTableHookProps): InfiniteTableReturnedHookProps => {
  const classes = useInfiniteTableStyles()

  const getRowClassName = useCallback(
    ({ index }) => {
      return clsx(classes.tableRow, classes.flexContainer)
    },
    [classes],
  )

  const headerRowRenderer = useCallback(
    props => {
      return <HeaderRow {...props} data={data} />
    },
    [data],
  )

  const rowRenderer = useCallback(props => {
    return <Row {...props} />
  }, [])

  const headerRenderer = useCallback(({ column, columnIndex }) => {
    return <HeaderCell column={column} columnIndex={columnIndex} />
  }, [])

  const cellRenderer = useCallback(props => {
    return <Cell {...props} />
  }, [])

  const renderingProps: RenderingProps = {
    getRowClassName,
    headerRowRenderer,
    rowRenderer,
    headerRenderer,
    cellRenderer,
    rowHeight: ROW_HEIGHT,
  }

  return { renderingProps, classes }
}
