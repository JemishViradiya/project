// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.
import cn from 'classnames'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Checkbox, Collapse, makeStyles, TableCell, TableRow } from '@material-ui/core'

import { CollapsibleCell } from '../CollapsibleCell'
import { useBasicTable, useTableExpandable, useTableSelection } from '../types'
import { useDraggableTableProps } from './context'
import { DraggableHandler } from './draggable'

interface RowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData: any
  rowDataIndex: number
}

const useStyles = makeStyles(theme => ({
  expandableRow: {
    '& td': {
      borderBottom: 'unset',
    },
  },
}))

const Row: React.FC<RowProps> = ({ rowData, rowDataIndex }) => {
  const [isRowExpanded, setIsRowExpanded] = useState<boolean>(false)
  const { t } = useTranslation(['general/form'])
  const { idFunction, columns, columnPicker, columnIdentifier } = useBasicTable()
  const selectionProps = useTableSelection()
  const draggableProps = useDraggableTableProps()
  const expandable = useTableExpandable()
  const { expandableRow } = useStyles()

  const shouldRenderExpandableRow = expandable && expandable?.isRowExpandable(rowData)

  const makeExpandableRow = (): React.ReactNode =>
    !draggableProps &&
    shouldRenderExpandableRow && (
      <TableRow hover={false}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={30}>
          <Collapse in={isRowExpanded} timeout="auto" unmountOnExit>
            {expandable?.renderExpandableRow(rowData)}
          </Collapse>
        </TableCell>
      </TableRow>
    )

  const makeExpandableButton = (): React.ReactNode => {
    if (!draggableProps && expandable) {
      return shouldRenderExpandableRow ? (
        <CollapsibleCell open={isRowExpanded} setOpen={setIsRowExpanded} />
      ) : (
        <TableCell padding="checkbox" />
      )
    } else {
      return null
    }
  }

  const ariaLabelIdentifier = useMemo(() => (rowData ? rowData[columnIdentifier] : null), [columnIdentifier, rowData])

  const makeCheckboxButton = (): React.ReactNode =>
    !draggableProps &&
    selectionProps && (
      <TableCell padding="checkbox">
        <Checkbox
          disabled={!selectionProps.isSelectable(rowData)}
          onClick={() => selectionProps.onSelect(rowData)}
          checked={selectionProps.isSelected(rowData)}
          size="small"
          {...(columnIdentifier &&
            rowData && {
              inputProps: { 'aria-label': t('general/form:ariaLabels.selectRow', { identifier: ariaLabelIdentifier }) },
            })}
        />
      </TableCell>
    )

  const draggableRowProps = draggableProps
    ? {
        component: DraggableHandler(idFunction(rowData), rowDataIndex, undefined),
      }
    : {}

  return (
    <>
      <TableRow
        {...draggableRowProps}
        selected={selectionProps && selectionProps.isSelected(rowData)}
        className={!draggableProps && shouldRenderExpandableRow ? expandableRow : undefined}
      >
        {makeExpandableButton()}
        {makeCheckboxButton()}
        {columns.map((column, index) => (
          <TableCell
            key={index}
            align={column.align ?? 'left'}
            className={cn('text-wrap', column.icon ? 'iconPadding' : undefined)}
          >
            {column.renderCell ? column.renderCell(rowData, rowDataIndex) : rowData[column.dataKey]}
          </TableCell>
        ))}
        {columnPicker && <TableCell />}
      </TableRow>
      {makeExpandableRow()}
    </>
  )
}

export default Row
