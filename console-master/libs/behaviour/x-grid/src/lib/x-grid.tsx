import React, { memo, useMemo } from 'react'

import { makeStyles, useTheme } from '@material-ui/core'
import type { GridColDef } from '@material-ui/x-grid'
import { LicenseInfo, useGridApiRef, XGrid as MuiXGrid } from '@material-ui/x-grid'

import { useBasicTable } from '@ues/behaviours'

import CustomLoadingOverlay from './components/loading-overlay'
import NoRowsOverlay from './components/no-rows-overlay'
import type { XGridProps } from './types'
import { useColumnResizer } from './utils/column-resize'
import { useXGridSelector } from './utils/x-grid-server-side-selection'
import { transformColumns } from './utils/x-grid-utils'

const ICON_WIDTH = 24
const STANDARD_THRESHOLD = 500

const useStyles = makeStyles(theme => ({
  clickableRow: {
    cursor: 'pointer',
  },
  placeholderCell: {
    padding: '0 !important',
  },
}))

if (process.env && process.env.NX_MUI_XGRID_KEY) {
  LicenseInfo.setLicenseKey(process.env.NX_MUI_XGRID_KEY)
} else {
  console.warn('XGrid license key is missing (NX_MUI_GRID_KEY)')
}

const NoRowsOverlayCustom = (noRowsMessageKey: string) => {
  return <NoRowsOverlay noRowsMessageKey={noRowsMessageKey} />
}

const LoadingOverlay = memo(() => {
  return <CustomLoadingOverlay />
})

const colPicker = (columnPicker, theme) => {
  return {
    field: 'columnPicker',
    renderHeader: props => columnPicker(props),
    sortable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    align: 'right',
    resizable: false,
    draggable: false,
    width: ICON_WIDTH + theme.spacing(8),
  } as GridColDef
}

const defaultIdFunction = row => row.id

const XGrid = ({
  classes = {},
  noRowsMessageKey = 'tables:noRows',
  wrapperStyle = { height: '100%', width: '100%' },
  tableName,
  dense = false,
  ...props
}: XGridProps) => {
  const theme = useTheme()
  const { columnPicker, columns, idFunction = defaultIdFunction, loading, onRowClick } = useBasicTable()
  const apiRef = useGridApiRef()

  const { clickableRow, placeholderCell } = useStyles()

  const components = useMemo(() => {
    return {
      LoadingOverlay: LoadingOverlay,
      NoRowsOverlay: () => NoRowsOverlayCustom(noRowsMessageKey),
    }
  }, [noRowsMessageKey])

  /**
   * Placeholder column, placed right after the column picker to prevent column picker column from re-rendering inside XGrid.
   */
  const placeholderColumn: GridColDef = {
    field: 'placeholder',
    headerName: '',
    sortable: false,
    disableColumnMenu: true,
    hideSortIcons: true,
    resizable: false,
    width: 0,
    minWidth: 0,
    cellClassName: placeholderCell,
    headerClassName: placeholderCell,
  }

  const { columnsWidth, onWidthChanges } = useColumnResizer(tableName, columns)

  const transformedColumns = useMemo(() => {
    const cols = transformColumns({ columns, columnsWidth })
    if (columnPicker) {
      cols.push(colPicker(columnPicker, theme))
      cols.push(placeholderColumn)
    }
    return cols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, columnPicker, columnsWidth])

  const tableSelectionProps = useXGridSelector(props.rows, apiRef)

  const denseProps = dense ? { rowHeight: 40, headerHeight: 40 } : {}

  return (
    <div style={wrapperStyle}>
      <MuiXGrid
        // existing table hooks do not respect column reorder
        disableColumnReorder
        disableSelectionOnClick
        hideFooter
        hideFooterSelectedRowCount
        hideFooterPagination
        onColumnWidthChange={onWidthChanges}
        columns={transformedColumns}
        components={components}
        apiRef={apiRef}
        getRowId={idFunction}
        loading={loading}
        scrollEndThreshold={STANDARD_THRESHOLD}
        onRowClick={onRowClick}
        {...denseProps}
        {...tableSelectionProps}
        {...props}
        classes={{
          ...classes,
          ...((typeof onRowClick === 'function' || typeof props.onRowClick === 'function') && {
            row: clickableRow,
          }),
        }}
      />
    </div>
  )
}

export default XGrid
