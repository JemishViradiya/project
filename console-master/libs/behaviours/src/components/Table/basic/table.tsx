import cn from 'classnames'
import { isEmpty } from 'lodash-es'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Checkbox,
  Collapse,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@material-ui/core'

import { boxFlexBetweenProps } from '@ues/assets'

import { CollapsibleCell } from '../CollapsibleCell'
import { LoadingTable } from '../loading'
import type { TableColumn, TableSortDirection } from '../types'
import { useBasicTable, useTableExpandable, useTableSelection, useTableSort } from '../types'

const useStyles = makeStyles(theme => ({
  expandableRow: {
    '& td': {
      borderBottom: 'unset',
    },
  },
}))

export type BasicTableProps = {
  data: any[]
  noDataPlaceholder?: React.ReactNode
  resolveColumnHeader?: (c: TableColumn) => any
  title?: string
}

const RowColumns = memo(
  ({
    columns,
    rowData,
    rowIndex,
    hasSelection,
  }: {
    columns: TableColumn[]
    rowData: any
    rowIndex: number
    hasSelection: boolean
  }) => {
    return (
      <>
        {columns.map((col, colIndex) => (
          <TableCell
            key={colIndex}
            align={col.align ?? 'left'}
            className={cn('text-wrap', col.icon ? 'iconPadding' : undefined)}
            aria-colindex={hasSelection ? ++colIndex + 1 : colIndex + 1}
            role="cell"
          >
            {col.renderCell ? col.renderCell(rowData, rowIndex) : rowData[col.dataKey]}
          </TableCell>
        ))}
      </>
    )
  },
)

const Row = ({ rowData, rowIndex }) => {
  const { columns, idFunction, columnPicker, onRowClick, columnIdentifier } = useBasicTable()
  const { t } = useTranslation(['general/form'])
  const selectionProps = useTableSelection()
  const expandable = useTableExpandable()
  const [open, setOpen] = useState()
  const totalColumns = columns.length + (columnPicker ? 1 : 0) + (selectionProps ? 1 : 0) + (expandable ? 1 : 0)
  const { expandableRow } = useStyles()
  const isSelected = selectionProps && selectionProps.isSelected(rowData)
  const onCheckboxClick = useCallback(
    event => {
      event.stopPropagation()
      event.preventDefault()
      selectionProps?.onSelect(rowData)
    },
    [selectionProps, rowData],
  )

  const accessibilityAriaRowIndex = rowIndex + 1
  const ariaLabelIdentifier = useMemo(() => (rowData ? rowData[columnIdentifier] : null), [columnIdentifier, rowData])

  return (
    <>
      <TableRow
        key={idFunction(rowData)}
        onClick={onRowClick ? event => onRowClick(rowData) : undefined}
        selected={isSelected}
        className={expandable && expandable.isRowExpandable(rowData) ? expandableRow : undefined}
        role="row"
        aria-label={idFunction(rowData)}
        aria-rowindex={accessibilityAriaRowIndex}
      >
        {expandable && expandable.isRowExpandable(rowData) && <CollapsibleCell open={open} setOpen={setOpen} />}
        {selectionProps && (
          <TableCell padding="checkbox" aria-label={`checkbox-${rowIndex}`} aria-colindex={1}>
            <Checkbox
              onClick={onCheckboxClick}
              checked={isSelected}
              size="small"
              {...(columnIdentifier &&
                rowData && {
                  inputProps: { 'aria-label': t('general/form:ariaLabels.selectRow', { identifier: ariaLabelIdentifier }) },
                })}
            />
          </TableCell>
        )}
        <RowColumns columns={columns} rowData={rowData} rowIndex={rowIndex} hasSelection={selectionProps !== undefined} />
        {columnPicker && <TableCell />}
      </TableRow>
      {expandable && expandable.isRowExpandable(rowData) && (
        <TableRow hover={false}>
          <TableCell style={{ padding: '0 0' }} colSpan={totalColumns} aria-colindex={1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              {expandable.renderExpandableRow(rowData)}
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

const COULUMN_HEADER_RESOLVER = (column: TableColumn): any => (column.renderLabel ? column.renderLabel() : column.label)

const TableBodyComponent = memo(
  ({ data, noDataPlaceholder, colSpan }: { data: any[]; noDataPlaceholder?: React.ReactNode; colSpan?: number }) => {
    return (
      <TableBody>
        {isEmpty(data) ? (
          <TableRow>
            <TableCell colSpan={colSpan} align="center" aria-colindex={1}>
              <Typography>{noDataPlaceholder}</Typography>
            </TableCell>
          </TableRow>
        ) : (
          data.map((rowData, rowIndex) => <Row key={rowIndex} rowData={rowData} rowIndex={rowIndex} />)
        )}
      </TableBody>
    )
  },
)

const TableHeaderColumns = memo(
  ({ resolveColumnHeader, hasSelection }: { resolveColumnHeader: (c: TableColumn) => any; hasSelection: boolean }) => {
    const { columns } = useBasicTable()
    const sortingProps = useTableSort()
    const expandable = useTableExpandable()

    const getProperAriaColIndex = (index: number) => {
      if (expandable && hasSelection) {
        return index + 3
      } else if (expandable || hasSelection) {
        return index + 2
      } else {
        return index + 1
      }
    }

    return (
      <>
        {columns.map((col, index) => (
          <TableCell
            key={index}
            align={col.align ?? 'left'}
            sortDirection={
              sortingProps && sortingProps.sort === col.dataKey ? (sortingProps.sortDirection as TableSortDirection) : undefined
            }
            style={{ ...col.styles, minWidth: col.width }}
            aria-colindex={getProperAriaColIndex(index)}
          >
            <Box {...boxFlexBetweenProps}>
              {sortingProps && (col.sortable || col.clientSortable) ? (
                <TableSortLabel
                  onClick={() => sortingProps.onSort(col.dataKey)}
                  active={sortingProps.sort === col.dataKey}
                  direction={sortingProps.sort === col.dataKey ? (sortingProps.sortDirection as TableSortDirection) : undefined}
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

const Expandable = () => {
  const expandable = useTableExpandable()
  return expandable ? <TableCell padding="checkbox" aria-colindex={1} /> : null
}

const SelectionCell = ({ data }) => {
  const expandable = useTableExpandable()
  const selectionProps = useTableSelection()
  const selectAll = useCallback(e => selectionProps.onSelectAll(e, data), [selectionProps, data])
  const { t } = useTranslation(['tables'])

  return selectionProps ? (
    <TableCell padding="checkbox" aria-label={t('selectAll')} aria-colindex={expandable ? 2 : 1}>
      <Checkbox
        indeterminate={selectionProps.isSomeSelected(data)}
        checked={selectionProps.isAllSelected(data)}
        inputProps={{ 'aria-label': t('selectAll') }}
        onChange={selectAll}
        size="small"
      />
    </TableCell>
  ) : null
}

const BasicTable: React.FC<BasicTableProps> = (props: BasicTableProps) => {
  const { data, resolveColumnHeader = COULUMN_HEADER_RESOLVER, noDataPlaceholder } = props
  const selectionProps = useTableSelection()
  const { columnPicker, embedded, columns } = useBasicTable()
  const picker = useMemo(() => columnPicker && columnPicker({}), [columnPicker])

  return (
    <TableContainer>
      <Table size={embedded ? 'small' : 'medium'} title={props.title}>
        <TableHead>
          <TableRow>
            <Expandable />
            <SelectionCell data={data} />
            <TableHeaderColumns resolveColumnHeader={resolveColumnHeader} hasSelection={selectionProps !== undefined} />
            {picker}
          </TableRow>
          <LoadingTable />
        </TableHead>
        <TableBodyComponent data={data} noDataPlaceholder={noDataPlaceholder} colSpan={columns.length + 1} />
      </Table>
    </TableContainer>
  )
}

export default BasicTable
