import clsx from 'clsx'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

import type { PopoverProps, TableCellBaseProps } from '@material-ui/core'
import {
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  Popover,
  TableCell,
  Typography,
} from '@material-ui/core'

import { usePropDrivenState } from '@ues-behaviour/react'
import { useUesSession } from '@ues-data/shared'
import { Columns } from '@ues/assets'

import { usePopover } from '../../popovers'
import type { TableColumn } from './types'
import { filterOutHiddenColumns, restoreColumnsVisibility, saveColumnsVisibility } from './utils'

export const columnPickerWidth = 45

export const useColumnPickerStyles = makeStyles(theme => ({
  cell: {
    width: columnPickerWidth,
    padding: 0,
    textAlign: 'center',
    verticalAlign: 'middle',
    cursor: 'pointer',
    height: 'inherit',
    '& :hover': {
      color: theme.palette.secondary.main,
    },
  },
  columnsWithoutCell: {
    display: 'flex',
    cursor: 'pointer',
    '& :hover': {
      color: theme.palette.secondary.main,
    },
  },
}))

export type ColumnPickerProps = {
  title?: string
  cols?: { id: string; show: boolean; canToggle: boolean; label: string }[]
  setVisibility?: (index: number) => void
  className?: string
  removeAnchorEl?: boolean
  /**
   * Enclose column picker in a table cell.
   * When using XGrid tableCell should be false, in other cases tableCell is on true
   * XGrid don't need any TableCell wrapping
   */
  tableCell?: boolean
  /**
   * The component override for a table cell, only applicable when tableCell is true.
   */
  component?: React.ElementType<TableCellBaseProps>
}

const ColumnPicker = memo(
  (props: ColumnPickerProps): JSX.Element => {
    const { cols, setVisibility, title, component, tableCell = true, removeAnchorEl = false } = props
    const classes = useColumnPickerStyles()
    const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()
    const listItems = useMemo(() => {
      return cols.map((col, i) => (
        <ListItem key={col.id} button dense disabled={!col.canToggle} onClick={() => setVisibility(i)}>
          <ListItemIcon>
            <Checkbox edge="start" checked={col.show} tabIndex={-1} inputProps={{ 'aria-labelledby': col.id }} />
          </ListItemIcon>
          <ListItemText id={col.id} primary={col.label} />
        </ListItem>
      ))
    }, [cols, setVisibility])

    const popoverProps: Partial<PopoverProps> = {
      anchorOrigin: {
        vertical: removeAnchorEl ? 'top' : 'bottom',
        horizontal: 'right',
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    }

    return (
      <>
        {tableCell ? (
          <TableCell className={clsx(classes.cell, props.className)} component={component ?? 'td'} aria-label="columnPicker">
            <Columns onClick={handlePopoverClick} />
          </TableCell>
        ) : (
          <div className={classes.columnsWithoutCell}>
            <Columns onClick={handlePopoverClick} aria-label="columnPicker" />
          </div>
        )}
        <Popover
          open={popoverIsOpen}
          anchorEl={!removeAnchorEl && popoverAnchorEl}
          onClose={handlePopoverClose}
          elevation={20}
          {...popoverProps}
        >
          <List>
            <ListSubheader>
              <Typography variant="h4">{title}</Typography>
            </ListSubheader>
            {listItems}
          </List>
        </Popover>
      </>
    )
  },
)

export type ColumnPickerHookProps = {
  displayedColumns: TableColumn[]
  columnPickerProps: ColumnPickerProps
}

export const useColumnPicker = (props: {
  columns: TableColumn[]
  title?: string
  className?: string
  tableName?: string
  columnPickerOverrides?: string[]
}): ColumnPickerHookProps => {
  const { columns, title, className, tableName } = props
  const columnPickerOverrides = useMemo(() => props.columnPickerOverrides ?? [], [props.columnPickerOverrides])
  const { userId = 'general' } = useUesSession() // per user config

  const resolvedTableName = useMemo(() => `${userId}_${tableName ? tableName : columns.map(c => c.dataKey).join('_')}`, [
    tableName,
    columns,
    userId,
  ])
  const filteredColumns = useMemo(() => filterOutHiddenColumns(columns), [columns])
  const [savedVisibility, setSavedVisibility] = useState(restoreColumnsVisibility(resolvedTableName))

  const mappedColumns = useMemo(
    () =>
      filteredColumns.map(c => ({
        id: c.dataKey,
        show: savedVisibility[c.dataKey] !== undefined ? savedVisibility[c.dataKey] : c.show !== undefined ? c.show : true,
        label: c.label,
        canToggle: !c.persistent,
      })),
    [filteredColumns, savedVisibility],
  )

  const [columnPickerColumns, setColumnPickerColumns] = usePropDrivenState(mappedColumns)

  const setVisibility = useCallback(
    (index: number) => {
      setColumnPickerColumns(columnPickerColumns => {
        const newColumns = [...columnPickerColumns]
        newColumns[index].show = !newColumns[index].show
        const newVisibilityConfig = { ...savedVisibility, [newColumns[index].id]: newColumns[index].show }
        saveColumnsVisibility(resolvedTableName, newVisibilityConfig)
        setSavedVisibility(newVisibilityConfig)
        return newColumns
      })
    },
    [resolvedTableName, savedVisibility, setColumnPickerColumns],
  )

  const isColumnVisible = useCallback(
    (id: string, columnPickerOverrides: string[]) =>
      columnPickerColumns.find(column => column.id === id && (column.show || columnPickerOverrides.includes(id))),
    [columnPickerColumns],
  )

  const overrideToggle = (columnPickerColumns: ColumnPickerProps['cols']) =>
    columnPickerColumns.map(c => ({ ...c, canToggle: columnPickerOverrides.includes(c.id) ? false : c.canToggle }))

  const columnPickerProps = { title, className, cols: overrideToggle(columnPickerColumns), setVisibility, isColumnVisible }

  const displayedColumns = useMemo(() => filteredColumns.filter(c => isColumnVisible(c.dataKey, columnPickerOverrides)), [
    columnPickerOverrides,
    filteredColumns,
    isColumnVisible,
  ])

  return { displayedColumns, columnPickerProps }
}

export default ColumnPicker
