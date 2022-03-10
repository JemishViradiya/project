import get from 'lodash/get'
import random from 'lodash/random'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AutoSizer, Grid, InfiniteLoader, ScrollSync } from 'react-virtualized'

import { useTheme } from '@material-ui/core'
// components
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Chip from '@material-ui/core/Chip'
import CircularProgress from '@material-ui/core/CircularProgress'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import Fade from '@material-ui/core/Fade'
import { default as MuiGrid } from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Link from '@material-ui/core/Link'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import TableCell from '@material-ui/core/TableCell'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import {
  boxFlexBetweenProps,
  boxFlexCenterProps,
  chipsRootProps,
  chipsTransitionProps,
  chipTransitionProps,
  Columns,
} from '@ues/assets'
import { STRING_OPERATORS, useColumns, useFilter, useFilterLabels, usePopover, useSelected } from '@ues/behaviours'

import { renderFilter } from './../Filters/filters.utils'
import { CURSOR_ENDPOINT_CORE, DEFAULT_COLUMNS } from './table.constants'
import { getCursorMockData, mockSuggestions } from './table.data'
import { getFilteredRows } from './table.utils'

const mockData = getCursorMockData()
const DEFAULT_COL_WIDTH = 175
const DEFAULT_ROW_HEIGHT = 60
const CHECKBOX_COL_WIDTH = 55

// TODO: update to use useColumns hooks

const VirtualTableFooter = ({ renderedRowsCount = 0 }) => {
  return (
    <Toolbar>
      <Box display="flex" justifyContent="flex-end" width="100%">
        <Typography variant="caption" color="textSecondary">
          Viewing {renderedRowsCount} of Many
        </Typography>
      </Box>
    </Toolbar>
  )
}

const VirtualTableToolbar = ({ columns, setVisibility }) => {
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  return (
    <Toolbar>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box>
          {/* TODO: add disabled logic based on table selections */}
          <Button disabled variant="outlined">
            Some Action
          </Button>
        </Box>
        <Box>
          <IconButton onClick={handlePopoverClick}>
            <Columns />
          </IconButton>
          <Menu
            open={popoverIsOpen}
            anchorEl={popoverAnchorEl}
            onClose={handlePopoverClose}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <ListSubheader>
              <Typography variant="subtitle1" color="textPrimary" gutterBottom>
                Table Columns
              </Typography>
            </ListSubheader>
            {columns.map((col, i) => (
              <MenuItem key={col.id} disabled={!col.canToggle} onClick={() => setVisibility(i)} button>
                <ListItemIcon>
                  <Checkbox edge="start" checked={col.show} />
                </ListItemIcon>
                <ListItemText primary={col.label} />
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    </Toolbar>
  )
}

export const VirtualTableWithGrid = () => {
  const theme = useTheme()
  const memoizedCols = useMemo(() => DEFAULT_COLUMNS, [])
  const { columns, setVisibility, isColumnVisible } = useColumns(memoizedCols)

  const headerGridRef = useRef(null)
  const bodyGridRef = useRef(null)

  const totalWidthOfColumns = cols => {
    return cols.reduce((allColsWidth, col) => {
      if (isColumnVisible(col.id)) {
        const colWidth = col.minWidth ? col.minWidth : DEFAULT_COL_WIDTH
        return (allColsWidth += colWidth)
      }

      return allColsWidth
    }, CHECKBOX_COL_WIDTH)
  }

  const isLastVisibleCol = (i, cols) => {
    const visibleCols = cols.filter(col => isColumnVisible(col.id))
    const length = visibleCols.length

    return cols[i].id === visibleCols[length - 1].id
  }

  const getColWidth = ({ index, width: gridWidth }) => {
    // checkbox column index === 0, return static width
    if (index === 0) return CHECKBOX_COL_WIDTH

    // if column is hidden, return 0
    if (!isColumnVisible(columns[index - 1].id)) {
      return 0
    }

    const totalColWidth = totalWidthOfColumns(columns)
    const colWidth = columns[index - 1].minWidth || DEFAULT_COL_WIDTH

    if (isLastVisibleCol(index - 1, columns) && totalColWidth < gridWidth) {
      // extend the last column to fill the remaining horizontal space in the table
      const remainingSpace = gridWidth - totalColWidth
      return colWidth + remainingSpace
    }

    return colWidth
  }

  const fixHeaderOverflow = () => {
    // fixes a bug that causes the header grid to switch between overflow hidden and auto
    const headerOverflow = get(headerGridRef, 'current._scrollingContainer.style.overflow', '')

    if (headerOverflow !== 'hidden') {
      headerGridRef.current._scrollingContainer.style.overflow = 'hidden'
    }
  }

  const [data, setData] = useState([])
  const [nextEndpoint, setNextEndpoint] = useState(null)
  const [isLastPage, setIsLastPage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const { activeFilters, onSetFilter, onSelectFilter, onRemoveFilter, onClearFilters } = useFilter()
  const { activeFilterLabels, hasActiveFilters } = useFilterLabels(activeFilters, columns)

  const { onSelect, onSelectAll, isSelected, getNumSelectedOnPage } = useSelected('name')

  const getSuggestions = () => setSuggestions(mockSuggestions)

  const filteredData = getFilteredRows(data, activeFilters, columns)
  const numSelected = getNumSelectedOnPage(filteredData)

  const recomputeGridSizes = () => {
    if (bodyGridRef.current && headerGridRef.current) {
      bodyGridRef.current.recomputeGridSize()
      headerGridRef.current.recomputeGridSize()
    }
  }

  const setColumnVisibility = columnIndex => {
    setVisibility(columnIndex)
    recomputeGridSizes()
  }

  const headerCellRenderer = ({ key, columnIndex, style }) => {
    if (columnIndex === 0) {
      return (
        <TableCell key={key} padding="checkbox" component="div" variant="head" style={{ ...style }}>
          <Checkbox
            onClick={event => onSelectAll(event, filteredData)}
            checked={filteredData.length > 0 && numSelected === filteredData.length}
            indeterminate={numSelected > 0 && numSelected < filteredData.length}
          />
        </TableCell>
      )
    }

    const { id, label, sortable, filterType } = DEFAULT_COLUMNS[columnIndex - 1]

    const columnVisible = isColumnVisible(columns[columnIndex - 1].id)
    if (!columnVisible) {
      return null
    }

    return (
      <TableCell key={key} component="div" variant="head" style={{ ...style }}>
        <Box {...boxFlexBetweenProps}>
          {!sortable ? label : <TableSortLabel>{label}</TableSortLabel>}
          {renderFilter(filterType, {
            activeFilters,
            onSetFilter,
            onSelectFilter,
            label: label,
            filterKey: id,
            // --TODO: the following props are specific to certain filters,
            //         consider a `renderFilters` function in the column
            //         defintion rather than `filterType`
            items: filteredData.map(data => data[id]),
            min: 0,
            max: 80,
            operators: STRING_OPERATORS,
            getSuggestions,
            suggestions,
          })}
        </Box>
      </TableCell>
    )
  }

  const bodyCellContentRenderer = ({ fieldText, useTooltip, rowIndex }) => {
    if (isLoading && rowIndex === data.length - 1) {
      return (
        <Box flexDirection="row" {...boxFlexCenterProps} bgcolor={theme.palette.common.offwhite}>
          <CircularProgress color="secondary" />
          <Box p={4}>
            <Typography variant="body2" color="textSecondary">
              Loading ...
            </Typography>
          </Box>
        </Box>
      )
    }

    if (useTooltip) {
      return (
        <Tooltip title={fieldText} interactive placement="top" enterDelay={500} leaveDelay={0}>
          <Typography variant="body2" noWrap>
            {fieldText}
          </Typography>
        </Tooltip>
      )
    }

    return (
      <Typography variant="body2" noWrap>
        {fieldText}
      </Typography>
    )
  }

  const bodyCellRenderer = ({ style, key, rowIndex, columnIndex, isScrolling, isVisible, scrollLeft }) => {
    const isLastRowLoading = isLoading && rowIndex === data.length - 1
    if (columnIndex === 0) {
      return isLastRowLoading ? null : (
        <TableCell
          key={key}
          padding="checkbox"
          component="div"
          variant="body"
          style={{ ...style }}
          onClick={() => onSelect(filteredData[rowIndex])}
        >
          <Checkbox checked={isSelected(filteredData[rowIndex])} />
        </TableCell>
      )
    }

    const columnVisible = isColumnVisible(columns[columnIndex - 1].id)
    if (!columnVisible) {
      return null
    }

    const dataKey = Object.keys(filteredData[rowIndex])[columnIndex - 1]
    const useTooltip = dataKey === 'name' ? true : false
    const fieldText = isScrolling && !isVisible ? '-' : filteredData[rowIndex][dataKey].toString()
    const cellStyles = isLastRowLoading
      ? {
          ...style,
          position: 'absolute',
          width: '100vw',
          left: scrollLeft,
          justifyContent: 'center',
        }
      : style

    return (
      <TableCell key={key} component="div" variant="body" style={cellStyles} onClick={() => onSelect(filteredData[rowIndex])}>
        {bodyCellContentRenderer({
          fieldText,
          useTooltip,
          rowIndex,
          columnIndex,
        })}
      </TableCell>
    )
  }

  const isRowLoaded = ({ index }) => isLastPage || index < data.length

  // the following function is to mock sagas function
  const requestMoreRows = () => {
    const endpoint = nextEndpoint || CURSOR_ENDPOINT_CORE
    const response = mockData[endpoint]
    const newData = [...data, ...response.data]
    setIsLastPage(response.meta.nextEndpoint === null)
    // these following lines are for mocking redux state
    setNextEndpoint(response.meta.nextEndpoint)
    setData(newData)
    setIsLoading(false)
  }

  const loadMoreRows = () => {
    if (isLastPage) {
      return
    }
    setIsLoading(true)
    // this mimic dispatch sagas action to call endpoint
    setTimeout(requestMoreRows, random(500, 5000))
  }

  const onTableResize = () => {
    recomputeGridSizes()
    fixHeaderOverflow()
  }

  useEffect(() => {
    loadMoreRows()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // effect to handle overflow property of header grid when table is re-rendered
  useEffect(() => {
    fixHeaderOverflow()
  })

  return (
    <Paper
      elevation={0}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 500,
        height: 'calc(100vh - 40px)',
      }}
    >
      <VirtualTableToolbar columns={columns} setVisibility={setColumnVisibility} />
      <Collapse in={hasActiveFilters} {...chipsTransitionProps}>
        <Box {...chipsRootProps}>
          <MuiGrid container spacing={2}>
            {activeFilterLabels.map(({ label, filterKey }) => (
              <MuiGrid item key={filterKey}>
                <Fade {...chipTransitionProps}>
                  <Chip
                    label={<Typography variant="body2">{label}</Typography>}
                    variant="outlined"
                    onDelete={() => onRemoveFilter(filterKey)}
                  />
                </Fade>
              </MuiGrid>
            ))}
          </MuiGrid>
          <Link
            href="#"
            variant="body2"
            onClick={event => {
              event.preventDefault()
              onClearFilters()
            }}
          >
            Clear
          </Link>
        </Box>
      </Collapse>
      <ScrollSync>
        {({ onScroll, scrollLeft }) => (
          <>
            <div className="table-header-wrapper">
              <AutoSizer disableHeight onResize={onTableResize}>
                {({ width }) => (
                  <Grid
                    ref={headerGridRef}
                    cellRenderer={headerCellRenderer}
                    columnCount={DEFAULT_COLUMNS.length + 1}
                    columnWidth={({ index }) => getColWidth({ index, width })}
                    estimatedColumnSize={DEFAULT_COL_WIDTH}
                    rowCount={1}
                    rowHeight={DEFAULT_ROW_HEIGHT}
                    width={width}
                    height={DEFAULT_ROW_HEIGHT}
                    style={{ overflow: 'hidden' }}
                    scrollLeft={scrollLeft}
                  />
                )}
              </AutoSizer>
            </div>
            <div className="table-body-wrapper" style={{ flex: 1 }}>
              <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={isLastPage ? filteredData.length : filteredData.length + 1}
                threshold={5}
              >
                {({ onRowsRendered, registerChild }) => (
                  <AutoSizer onResize={onTableResize}>
                    {({ width, height }) => (
                      <Grid
                        ref={ref => {
                          bodyGridRef.current = ref
                          registerChild(ref)
                        }}
                        cellRenderer={options => bodyCellRenderer({ ...options, scrollLeft })}
                        noContentRenderer={() => (
                          <Box p={4} flexDirection="row" {...boxFlexCenterProps} justifyContent="center" width="100vw">
                            <CircularProgress color="secondary" />
                            <Box p={4}>
                              <Typography variant="body2" color="textSecondary">
                                Loading ...
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        columnCount={DEFAULT_COLUMNS.length + 1}
                        columnWidth={({ index }) => getColWidth({ index, width })}
                        estimatedColumnSize={DEFAULT_COL_WIDTH}
                        rowCount={filteredData.length}
                        rowHeight={DEFAULT_ROW_HEIGHT}
                        width={width}
                        height={height}
                        onScroll={onScroll}
                        onSectionRendered={({ rowStartIndex, rowStopIndex }) => {
                          onRowsRendered({
                            startIndex: rowStartIndex,
                            stopIndex: rowStopIndex,
                          })
                        }}
                        style={{ outline: 'none' }}
                      />
                    )}
                  </AutoSizer>
                )}
              </InfiniteLoader>
            </div>
          </>
        )}
      </ScrollSync>
      <Divider />
      <VirtualTableFooter renderedRowsCount={filteredData.length} />
    </Paper>
  )
}
