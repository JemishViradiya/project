import cn from 'classnames'
import memoizeOne from 'memoize-one'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AutoSizer, CellMeasurer, CellMeasurerCache, Column, InfiniteLoader, Table } from 'react-virtualized'

import { Box, Typography } from '@material-ui/core'

import { usePrevious } from '@ues-behaviour/react'
import { AriaElementLabel } from '@ues/assets-e2e'

import { columnPickerWidth } from '../columnPicker'
import type { InfiniteTableProps } from '../types'
import { useBasicTable, useTableSelection } from '../types'
import { useInfiniteTableContext } from './provider'

const standardWidth = { flexGrow: 1, flexShrink: 1, width: 150 }
const cacheKeyMapper = (rowIndex: number, columnIndex: number) => columnIndex

const useCachedWidths = (columns, rowHeight, extraColumnsWidth) => {
  const initialColumnsWidth = useMemo(() => columns.reduce((p, c) => p + (c.width ? c.width : 150), 0) + extraColumnsWidth, [
    columns,
    extraColumnsWidth,
  ])
  const [tableWidth, setTableWidth] = useState(0)
  const previousInitialColumnsWidth = usePrevious(initialColumnsWidth)
  const previousTableWidth = usePrevious(tableWidth)
  const columnsWidthHaveChanged = initialColumnsWidth !== previousInitialColumnsWidth
  const tableWidthHasChanged = tableWidth !== previousTableWidth
  const cacheConfig = useRef({
    defaultHeight: rowHeight,
    fixedHeight: true,
    keyMapper: cacheKeyMapper,
  })
  const getWidth = useCallback(
    containerWidth => {
      let cachedWidths = 0
      columns.forEach((column, index) => {
        cachedWidths += cachedMeasurements.current.getWidth(0, index)
      })
      const columnsWidth =
        columnsWidthHaveChanged || tableWidthHasChanged ? initialColumnsWidth : Math.max(initialColumnsWidth, cachedWidths)
      return Math.max(containerWidth, columnsWidth)
    },
    [columns, columnsWidthHaveChanged, initialColumnsWidth, tableWidthHasChanged],
  )
  const [measurementsUpdate, toggleMeasurementsUpdate] = useState(false)
  const columnsMeasureFns = useRef([])
  const cachedMeasurements = useRef(new CellMeasurerCache(cacheConfig.current))
  const invalidateMeasurementsCache = useCallback(() => {
    cachedMeasurements.current.clearAll()
    columns.forEach((column, index) => {
      columnsMeasureFns.current[index]?.()
    })
    toggleMeasurementsUpdate(!measurementsUpdate)
  }, [columns, measurementsUpdate])

  useEffect(() => {
    if (columnsWidthHaveChanged) {
      invalidateMeasurementsCache()
    }
  }, [columnsWidthHaveChanged, invalidateMeasurementsCache])
  const onResize = useCallback(
    ({ width }) => {
      if (width !== tableWidth) {
        setTableWidth(width)
        invalidateMeasurementsCache()
      }
    },
    [invalidateMeasurementsCache, tableWidth],
  )
  const updateColumnsMeasureFn = useCallback((index, fn) => {
    columnsMeasureFns.current[index] = fn
  }, [])

  return {
    onResize,
    columnsWidthHaveChanged,
    getWidth,
    cachedMeasurements: cachedMeasurements.current,
    updateColumnsMeasureFn,
  }
}

const InfinitTable: React.FC<InfiniteTableProps> = ({ noDataPlaceholder, infinitLoader, extraClasses, ...tableProps }) => {
  const { renderingProps, classes, rowCount, rowGetter } = useInfiniteTableContext()
  const { columns, onRowClick, columnPicker } = useBasicTable()
  const selectionProps = useTableSelection()
  const { getRowClassName, headerRowRenderer, rowRenderer, headerRenderer, cellRenderer, rowHeight } = renderingProps
  const { onResize, getWidth, cachedMeasurements, columnsWidthHaveChanged, updateColumnsMeasureFn } = useCachedWidths(
    columns,
    rowHeight,
    columnPicker || selectionProps ? columnPickerWidth : 0,
  )
  const wrapperClassName = cn(classes?.autosizeWrapper, extraClasses)
  const tableRef = useRef(null)

  return (
    <div className={wrapperClassName} aria-label={AriaElementLabel.InfiniteTable}>
      <InfiniteLoader {...infinitLoader}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer onResize={onResize}>
            {({ height, width }) => {
              const refHandler = memoizeOne(ref => {
                tableRef.current = ref
                return registerChild(ref)
              })
              return (
                <Table
                  ref={refHandler}
                  onRowsRendered={onRowsRendered}
                  height={height}
                  width={getWidth(width)}
                  rowHeight={rowHeight}
                  gridStyle={{
                    direction: 'inherit',
                    outline: 'none',
                  }}
                  headerHeight={rowHeight}
                  className={classes?.table}
                  rowClassName={getRowClassName}
                  headerClassName={classes?.header}
                  headerRowRenderer={headerRowRenderer}
                  rowRenderer={rowRenderer}
                  noRowsRenderer={() => (
                    <Box p={3} textAlign="center">
                      <Typography variant="body2">{noDataPlaceholder}</Typography>
                    </Box>
                  )}
                  rowCount={rowCount}
                  rowGetter={rowGetter}
                  onRowClick={onRowClick}
                  deferredMeasurementCache={cachedMeasurements}
                  {...tableProps}
                >
                  {columns.map((column, index) => {
                    return (
                      <Column
                        key={column.dataKey}
                        headerRenderer={headerProps => (
                          <CellMeasurer
                            cache={cachedMeasurements}
                            columnIndex={index}
                            key={index}
                            rowIndex={0}
                            parent={tableRef.current}
                          >
                            {({ measure }) => {
                              updateColumnsMeasureFn(index, measure)
                              return headerRenderer({
                                ...headerProps,
                                column,
                                columnIndex: index,
                              })
                            }}
                          </CellMeasurer>
                        )}
                        className={classes?.tableCell}
                        cellRenderer={cellProps => cellRenderer({ ...cellProps, column })}
                        dataKey={column.dataKey}
                        {...standardWidth}
                        {...column}
                        {...(!columnsWidthHaveChanged &&
                          cachedMeasurements.has(0, index) && { width: cachedMeasurements.getWidth(0, index) })}
                      />
                    )
                  })}
                </Table>
              )
            }}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </div>
  )
}

export default InfinitTable
