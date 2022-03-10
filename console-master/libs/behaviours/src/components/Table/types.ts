// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.

import type { Moment } from 'moment'
import type React from 'react'
import { createContext, useContext } from 'react'

import type { TableCellProps, TableProps } from '@material-ui/core'
import type { GridCellValue, GridColDef, GridValueGetterParams } from '@material-ui/x-grid'

import type { RiskLevel } from '@ues-data/shared'

import type { FILTER_TYPE, NumericFilterUnits } from '../../filters'
import type { OPERATOR_VALUES } from '../../filters/filters.constants'
import type { FilterProps } from '../../filters/filters.hooks'
import type { UseSelected } from '../../tables/useSelected/useSelected'
import type { UseSort } from '../../tables/useSort/useSort'

export interface ClientSortableDataAccessor {
  (rowData: unknown): unknown
}

export interface FilterOptions<T = RiskLevel> {
  value: string | number | T
  label?: string | number
}

export interface TableColumn<TRowData = any> {
  align?: TableCellProps['align']
  dataKey: string
  label?: string
  exportValue?: (rowData: TRowData, rowDataIndex: number) => string
  renderCell?: (rowData: TRowData, rowDataIndex: number) => React.ReactNode
  valueGetter?: (rowData: GridValueGetterParams) => GridCellValue
  renderLabel?: () => React.ReactNode
  renderFilter?: () => React.ReactNode
  sortable?: boolean
  clientSortable?: boolean
  clientSortableDataAccessor?: ClientSortableDataAccessor
  persistent?: boolean
  show?: boolean
  width?: number // min width
  styles?: any
  filterType?: FILTER_TYPE
  icon?: boolean
  hidden?: boolean
  gridColDefProps?: Partial<GridColDef>
  isFlat?: boolean
  min?: number
  max?: number
  unit?: NumericFilterUnits
  options?: FilterOptions[]
  text?: boolean
}

export enum TableSortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export interface TableSort {
  sortBy?: string
  sortDir?: TableSortDirection
  updatedDataSource?: any[]
}

export interface TableDragChange {
  fromId: string
  fromIndex: number
  toId: string
  toIndex: number
  updatedDataSource: any[]
}

export interface DraggableProps {
  onDragChange: (dragChange: TableDragChange) => void
  onDataReorder?: (rowData: any, index: number) => void
  component: React.ReactNode
}

export interface DraggableTableProps {
  draggableEnabled?: boolean
  rankMode?: boolean
  noDataPlaceholder?: React.ReactNode
  data: any[]
  resolveColumnHeader?: (c: TableColumn) => any
  TableProps?: TableProps
}

interface Row {
  index: number
}

export interface RenderingProps {
  getRowClassName?: (row: Row) => string
  headerRowRenderer?: (props: { className: string; columns: React.ReactNode[]; style: any }) => React.ReactNode
  rowRenderer?: (props: { className: string; columns: React.ReactNode[]; style: any; rowData: any }) => React.ReactNode
  headerRenderer?: (props: { column: TableColumn; columnIndex: number }) => React.ReactNode
  cellRenderer?: (props: { cellData: any; column: TableColumn; columnIndex: number; rowData: any }) => React.ReactNode
  rowHeight?: number
}

export interface InfiniteTableProps {
  noDataPlaceholder?: React.ReactNode
  overscanRowCount?: number
  infinitLoader: {
    threshold?: number
    isRowLoaded: (row: Row) => boolean
    loadMoreRows: (offset: { startIndex: number; stopIndex: number }) => Promise<any>
    minimumBatchSize?: number
  }
  extraClasses?: string
}

export type ExpandableProps = {
  isRowExpandable?: (rowData: any) => boolean
  renderExpandableRow: (rowData: any) => React.ReactNode
}

export type BasicTableProps = {
  columns: TableColumn[]
  columnIdentifier?: string
  idFunction?: (rowData: any) => string
  onRowClick?: (rowData: any) => void
  columnPicker?: (props) => React.ReactNode
  loading?: boolean
  embedded?: boolean
  totalCount?: number
}

export type FilterOperatorsProps = {
  onToggleOperators: () => void
  onSelectOperator: (op: OPERATOR_VALUES) => () => void
  selectedOperator: OPERATOR_VALUES
  showOperators: boolean
}

export type ColumnsVisibility = Record<string, boolean>

export const TableFilterContext = createContext<FilterProps<any>>(null)
export const TableSortingContext = createContext<UseSort>(null)
export const TableSelectionContext = createContext<UseSelected<any>>(null)
export const TableExpandableContext = createContext<ExpandableProps>(null)
export const TableBasicContext = createContext<BasicTableProps>({
  columns: [],
  idFunction: (rowData: any) => rowData.id,
})

export const useTableFilter = <T extends any = any>() => useContext(TableFilterContext) as FilterProps<T>
export const useTableSort = () => useContext(TableSortingContext)
export const useTableSelection = () => useContext(TableSelectionContext)
export const useTableExpandable = () => useContext(TableExpandableContext)
export const useBasicTable = () => useContext(TableBasicContext)

export type DateObj = Moment
