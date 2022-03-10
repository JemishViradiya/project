import 'react-virtualized/styles.css'

import cn from 'classnames'
import debounce from 'lodash-es/debounce'
import memoizeOne from 'memoize-one'
import PropTypes from 'prop-types'
import React, { memo, PureComponent } from 'react'
import TooltipTrigger from 'react-popper-tooltip'
import { AutoSizer, CellMeasurer, CellMeasurerCache, Column, InfiniteLoader, SortIndicator } from 'react-virtualized'

import Checkbox from '@material-ui/core/Checkbox'

import { BasicMoreVert } from '@ues/assets'

import { Icon } from '../icons/Icon'
import { isSelected as IsSelected } from '../useSelection'
import IconButton from '../widgets/IconButton'
import ColumnOptions from './ColumnOptions'
import styles from './InfiniteList.module.less'
import Table from './Table'

const CHECKBOX_WIDTH = 30
const ROW_HEIGHT = 43
const LIST_MARGIN = 32

const DefaultCell = memo(({ className, cellData }) => <div className={className}>{cellData}</div>)

const eventStopPropagation = ev => ev.stopPropagation()

const gridStyle = { marginTop: 0 }

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: ROW_HEIGHT,
  minHeight: ROW_HEIGHT,
  minWidth: CHECKBOX_WIDTH,
})

export class InfiniteList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showColumnsMenu: false,
      resetEnabled: Object.values(this.props.headers).some(header => !header.disabled && header.visible !== header.defaultVisible),
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.showColumnsMenu && prevState.showColumnsMenu) {
      this.props.saveHeaders()
    }
  }

  headerRenderer = ({ columnData, dataKey, sortBy, sortDirection, label }) => {
    const { t } = this.props
    return (
      <div className={styles.headerCell} aria-label={t(`${label}${columnData?.isCheckList ? '' : 'ColumnAriaLabel'}`)}>
        <span className={styles.headerLabel} title={t(label)}>
          {t(label)}
        </span>
        {sortBy === dataKey && (
          <span className={styles.sortIndicator} title={t('common.list.order')}>
            <SortIndicator sortDirection={sortDirection} />
          </span>
        )}
      </div>
    )
  }

  headerCheckboxRender = () => {
    return (
      <Checkbox
        size="small"
        className={styles.listCheckbox}
        checked={this.props.selectedAll}
        onClick={eventStopPropagation}
        onChange={this.props.onSelectAll}
        inputProps={{ 'aria-label': this.props.t('common.list.selectAllAria') }}
      />
    )
  }

  cellCheckboxRender = ({ rowData, rowIndex, columnIndex, dataKey, parent }) => {
    const checkboxProps = {
      onClick: eventStopPropagation,
      inputProps: { 'data-index': rowIndex },
      onChange: this.onSelected,
      checked: this.props.selectionState ? this.isSelected(rowData.id) : false,
      size: 'small',
      className: styles.listCheckbox,
    }
    return this.props.autoRowHeight ? (
      <CellMeasurer cache={cache} columnIndex={columnIndex} key={dataKey} parent={parent} rowIndex={rowIndex}>
        {({ registerChild }) => <Checkbox {...checkboxProps} ref={registerChild} />}
      </CellMeasurer>
    ) : (
      <Checkbox {...checkboxProps} />
    )
  }

  cellDataGetter = ({ rowData, dataKey }) => {
    const header = this.props.headers[dataKey]
    if (header.cellDataGetter) {
      return header.cellDataGetter(rowData)
    }
    return header.dataFormatter(rowData[dataKey])
  }

  cellRenderer = ({ cellData, dataKey, columnIndex, key, parent, rowIndex, style }) => {
    const definition = this.props.headers[dataKey]
    if (definition.columnClassName) {
      return <DefaultCell className={definition.columnClassName} cellData={cellData} />
    } else if (definition.cellRenderer) {
      const cellProps = { data: cellData, dataKey, columnIndex, key, parent, rowIndex, style, cache }
      return definition.cellRenderer(cellProps)
    }
    return this.props.autoRowHeight ? (
      <CellMeasurer cache={cache} columnIndex={columnIndex} key={dataKey} parent={parent} rowIndex={rowIndex}>
        {({ registerChild }) => (
          <div ref={registerChild} style={style}>
            {cellData}
          </div>
        )}
      </CellMeasurer>
    ) : (
      cellData
    )
  }

  renderColumns = memoizeOne((width, headers, hasCheckboxColumn) => {
    const { isCheckList } = this.props
    const headersArray = Object.values(headers).filter(header => header.visible)
    const columnsArray = []
    const checkboxColumnWidth = hasCheckboxColumn ? CHECKBOX_WIDTH + (isCheckList ? 10 : 20) : 0
    let widthSoFar = checkboxColumnWidth
    headersArray.forEach((header, i) => {
      let columnWidth = header.width
      if (!columnWidth) {
        columnWidth = (width - checkboxColumnWidth) / headersArray.length
      }
      widthSoFar += columnWidth + 10
      columnsArray.push(
        <Column
          key={i}
          width={columnWidth}
          cellDataGetter={this.cellDataGetter}
          cellRenderer={this.cellRenderer}
          label={header.columnName}
          dataKey={header.dataKey}
          headerRenderer={this.headerRenderer}
          disableSort={header.disableSort}
          defaultSortDirection={header.defaultSortDirection}
          columnData={header.columnData}
        />,
      )
    })
    if (widthSoFar < width) {
      columnsArray.push(<Column key={headersArray.length} width={width - widthSoFar} dataKey="invalid_spacer" disableSort />)
    }
    return columnsArray
  })

  isRowLoaded = ({ index }) => {
    return !!this.props.data[index]
  }

  isSelected = index => {
    if (this.props.isSelected) {
      return this.props.isSelected(index)
    }
    return IsSelected(this.props.selectionState, index)
  }

  rowClassName = ({ index }) => {
    const { isCheckList } = this.props
    let rowClassName
    if (index < 0) {
      rowClassName = styles.headerRow
    } else {
      if (this.props.highlightId === this.props.data[index].id) {
        rowClassName = styles.hover
      } else if (
        !isCheckList &&
        this.props.selectionState &&
        (this.isSelected(this.props.data[index].id) || this.props.singleSelectId === this.props.data[index].id)
      ) {
        rowClassName = styles.selected
      } else {
        rowClassName = index % 2 === 0 ? styles.evenRow : styles.oddRow
      }
    }
    return cn(
      styles.row,
      rowClassName,
      isCheckList && styles.checkList,
      // isCheckList below is just an optimization as scrollbar width is not used for regular table/list view
      isCheckList && this.tableRef?.getScrollbarWidth() > 0 && styles.withScrollbar,
    )
  }

  rowGetter = ({ index }) => {
    return this.props.data[index]
  }

  sort = ({ sortBy, sortDirection }) => {
    this.resetForNextRender = true
    this.props.onSort({ sortBy, sortDirection })
  }

  resetScroll = () => {
    this.resetForNextRender = true
  }

  calculateWidth = memoizeOne((paneWidth, headers, isCheckList) => {
    let width = CHECKBOX_WIDTH + (isCheckList ? 10 : 20)
    Object.values(headers).forEach(header => {
      if (header.visible) {
        const columnWidth = !header.width ? width / Object.keys(headers).length : header.width
        width += columnWidth + 10
      }
    })
    return Math.max(width, paneWidth)
  })

  // TODO: More columns menu still needs more work here
  onMenuAllSelection = () => {
    const select = Object.values(this.props.headers).some(header => !header.disabled && !header.visible)
    this.props.onMenuAllSelection(select)
    this.setState({
      resetEnabled: true,
    })
  }

  onMenuReset = () => {
    if (!this.state.resetEnabled) return
    this.props.onMenuReset()
    this.setState({
      resetEnabled: false,
    })
  }

  onMenuCheckbox = (e, header) => {
    e.stopPropagation()
    this.props.onMenuCheckbox(header.dataKey)
    this.setState({
      resetEnabled: true,
    })
  }

  onSelected = event => {
    const rowIndex = event.target.getAttribute('data-index')
    const rowData = this.props.data[rowIndex]
    this.props.onSelected(rowIndex, rowData, { total: this.props.total })
  }

  showMoreColumns = () => {
    this.setState(state => ({
      showColumnsMenu: !state.showColumnsMenu,
    }))
  }

  renderMoreColumns = memoizeOne((width, scrollbarWidth) => {
    const selectAllEnabled = Object.values(this.props.headers).some(header => !header.disabled && !header.visible)
    return (
      <TooltipTrigger
        placement="bottom-end"
        trigger="click"
        tooltipShown={this.state.showColumnsMenu}
        onVisibilityChange={this.showMoreColumns}
        tooltip={({ getTooltipProps, tooltipRef }) => (
          <div
            {...getTooltipProps({
              ref: tooltipRef,
            })}
            id="list-menu"
            role="tooltip"
            className={styles.menuContainer}
          >
            <ColumnOptions headers={this.props.headers} onMenuCheckbox={this.onMenuCheckbox} />
            <div className={styles.bottomControls}>
              <span
                id="list-menu-select-all-button"
                key="button-all"
                className={styles.buttonLink}
                role="button"
                tabIndex="-1"
                onClick={this.onMenuAllSelection}
              >
                {this.props.t(selectAllEnabled ? 'common.list.selectAll' : 'common.list.unselectAll')}
              </span>
              <span
                id="list-menu-reset-button"
                key="button-clear"
                className={this.state.resetEnabled ? styles.buttonLink : styles.buttonLinkDisabled}
                role="button"
                tabIndex="-1"
                onClick={this.onMenuReset}
              >
                {this.props.t('common.list.reset')}
              </span>
            </div>
          </div>
        )}
      >
        {({ getTriggerProps, triggerRef }) => (
          <div
            {...getTriggerProps({
              ref: triggerRef,
              className: cn(styles.moreColumns, this.props.moreColumnsStyle),
              style: {
                left:
                  width -
                  (this.props.moreColumnsOffsetLarge
                    ? this.props.theme.custom.bisOffsets.table.header.moreLg
                    : this.props.theme.custom.bisOffsets.table.header.more) -
                  scrollbarWidth,
              },
            })}
          >
            <IconButton
              aria-label={this.props.t('common.list.customizeColumns')}
              aria-haspopup="true"
              aria-expanded={this.state.showColumnsMenu}
              size="small"
              title={this.props.t('common.list.customizeColumns')}
            >
              <Icon icon={BasicMoreVert} />
            </IconButton>
          </div>
        )}
      </TooltipTrigger>
    )
  })

  updateRowsRendered = debounce(
    ({ startIndex, stopIndex }) =>
      this.setState(() => ({
        startIndex: startIndex + 1,
        stopIndex: stopIndex + 1,
      })),
    320,
    { leading: true, maxWait: 320 },
  )

  componentWillUnmount() {
    this.updateRowsRendered.cancel()
    if (!this.props.hideMenu && this.props.saveHeaders) {
      this.props.saveHeaders()
    }
  }

  onRowsRendered = memoizeOne(next => (...args) => {
    this.updateRowsRendered(args[0])
    next(...args)
  })

  setTableRef = ref => {
    this.tableRef = ref
  }

  headerRowRenderer = memoizeOne(width => ({ columns, scrollbarWidth, className, ...props }) => {
    // we can't use onHeaderClick prop on react-virtualized/Table because click area does not cover whole header
    const { isCheckList, onHeaderClick } = this.props
    return (
      <>
        <div className={className} {...props} {...(onHeaderClick && { onClick: onHeaderClick, role: 'button' })}>
          {isCheckList ? <div className={cn(className, styles.checkList, styles.innerHeader)}>{columns}</div> : columns}
        </div>
        {!this.props.hideMenu
          ? this.renderMoreColumns(width, scrollbarWidth, this.props.headers, this.state.resetEnabled, this.state.showColumnsMenu)
          : null}
      </>
    )
  })

  tableStyle = memoizeOne((width, listMargin) => ({ width: width, marginLeft: listMargin }))

  renderTable = memoizeOne(
    (
      onRowsRendered,
      registerChild,
      width,
      height,
      headers,
      onRowMouseOut,
      onRowMouseOver,
      onRowClick,
      onSelectAll,
      selectable,
      data,
      highlightId,
      sortDirection,
      sortBy,
      rowStyle,
      autoRowHeight,
      isCheckList,
      dynamicHeightElementRef,
    ) => {
      const doReset = this.resetForNextRender
      this.resetForNextRender = false
      const combinedWidth = this.calculateWidth(width, headers, isCheckList)
      const checkboxColumn =
        selectable && onSelectAll ? (
          <Column
            width={CHECKBOX_WIDTH}
            cellRenderer={this.cellCheckboxRender}
            dataKey="invalid_checkbox"
            headerRenderer={this.headerCheckboxRender}
            disableSort
          />
        ) : null

      if (autoRowHeight) {
        cache.clearAll()
      }

      const headerHeight = ROW_HEIGHT
      const rowHeight = autoRowHeight ? cache.rowHeight : ROW_HEIGHT
      const rowCount = data.length
      const listHeight = headerHeight + rowHeight * rowCount

      /**
       * Used to reduce element height if elements take less space than container height.
       * We want to set this only once to not get into auto-sizer loop.
       */
      if (dynamicHeightElementRef && listHeight < height && !dynamicHeightElementRef.current?.style.height) {
        dynamicHeightElementRef.current.style.height = `${listHeight}px`
      }

      const refHandler = memoizeOne(ref => {
        this.setTableRef(ref)
        return registerChild(ref)
      })

      return (
        <Table
          className={onRowClick ? styles.table : cn(styles.table, styles.noRowClick)}
          deferredMeasurementCache={autoRowHeight ? cache : null}
          headerRowRenderer={this.headerRowRenderer(width)}
          style={this.tableStyle(width, this.props.listMargin)}
          gridStyle={gridStyle}
          width={combinedWidth}
          gridWidth={width}
          onRowsRendered={this.onRowsRendered(onRowsRendered)}
          headerClassName={isCheckList ? styles.headerColumnChecklist : styles.headerColumn}
          gridClassName={styles.grid}
          height={height}
          headerHeight={headerHeight}
          rowHeight={rowHeight}
          rowClassName={this.rowClassName}
          scrollToIndex={doReset ? 0 : undefined}
          sort={this.sort}
          sortBy={sortBy}
          sortDirection={sortDirection}
          ref={refHandler}
          onRowClick={onRowClick}
          onRowMouseOver={onRowMouseOver}
          onRowMouseOut={onRowMouseOut}
          rowCount={rowCount}
          rowStyle={rowStyle}
          rowGetter={this.rowGetter}
        >
          {checkboxColumn}
          {this.renderColumns(width, headers, !!checkboxColumn)}
        </Table>
      )
    },
  )

  renderAutosized = memoizeOne(({ onRowsRendered, registerChild }) => ({ width, height }) => {
    const widthWithoutMargin = width - 2 * this.props.listMargin

    const {
      headers,
      onRowMouseOut,
      onRowMouseOver,
      onRowClick,
      onSelectAll,
      selectable,
      sortDirection,
      sortBy,
      data,
      highlightId,
      rowStyle,
      autoRowHeight,
      isCheckList,
      dynamicHeightElementRef,
    } = this.props
    return this.renderTable(
      onRowsRendered,
      registerChild,
      widthWithoutMargin,
      height,
      headers,
      onRowMouseOut,
      onRowMouseOver,
      onRowClick,
      onSelectAll,
      selectable,
      data,
      highlightId,
      sortDirection,
      sortBy,
      rowStyle,
      autoRowHeight,
      isCheckList,
      dynamicHeightElementRef,
      this.props.selectionState,
      this.state.resetEnabled,
      this.state.showColumnsMenu,
    )
  })

  render() {
    const batchSize = this.props.minimumBatchSize || 25
    const counter = this.props.noCounter ? null : (
      <span className={styles.rowCounter} aria-label={this.props.t('common.list.visibleRowsAriaLabel')}>
        {this.props.t('common.list.itemsCount', {
          start: this.state.startIndex || 0,
          stop: this.state.stopIndex || 0,
          total: this.props.total || 0,
        })}
      </span>
    )
    return (
      <div className={cn(styles.autosizeWrapper, this.props.className)}>
        {counter}
        <InfiniteLoader
          threshold={batchSize * 2}
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.props.onLoadMoreRows}
          minimumBatchSize={batchSize}
          data-size={this.props.data.length}
          rowCount={this.props.total}
        >
          {loaderProps => <AutoSizer>{this.renderAutosized(loaderProps)}</AutoSizer>}
        </InfiniteLoader>
      </div>
    )
  }
}

InfiniteList.propTypes = {
  onLoadMoreRows: PropTypes.func.isRequired,
  onSort: PropTypes.func,
  highlightId: PropTypes.string,
  singleSelectId: PropTypes.string,
  isSelected: PropTypes.func,
  selectionState: PropTypes.object,
  onSelected: PropTypes.func,
  onSelectAll: PropTypes.func,
  selectedAll: PropTypes.bool,
  selectable: PropTypes.bool,
  sortBy: PropTypes.string,
  onRowClick: PropTypes.func,
  onHeaderClick: PropTypes.func,
  onRowMouseOver: PropTypes.func,
  onRowMouseOut: PropTypes.func,
  sortDirection: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  total: PropTypes.number,
  headers: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onMenuAllSelection: PropTypes.func,
  onMenuReset: PropTypes.func,
  onMenuCheckbox: PropTypes.func,
  onRowsRendered: PropTypes.func,
  saveHeaders: PropTypes.func,
  noCounter: PropTypes.any,
  minimumBatchSize: PropTypes.number,
  className: PropTypes.string,
  listMargin: PropTypes.number,
  rowStyle: PropTypes.object,
  autoRowHeight: PropTypes.bool,
  hideMenu: PropTypes.bool,
  isCheckList: PropTypes.bool,
  dynamicHeightElementRef: PropTypes.object,
  theme: PropTypes.object,
}

InfiniteList.defaultProps = {
  listMargin: LIST_MARGIN,
  selectable: true,
}

export default InfiniteList
