import cn from 'classnames'
import memoizeOne from 'memoize-one'
import PropTypes from 'prop-types'
import React from 'react'
import { Table } from 'react-virtualized'

import Grid from './Grid'
import styles from './InfiniteList.module.less'

export default class ScrollingTable extends Table {
  /**
   * Determines the flex-shrink, flex-grow, and width values for a cell (header or column).
   * Overridden to force flexShrink to 0 for all columns.
   */
  _getFlexStyleForColumn(column, customStyle = {}) {
    const flexValue = `${column.props.flexGrow} 0 ${column.props.width}px`

    const style = {
      ...customStyle,
      flex: flexValue,
      msFlex: flexValue,
      WebkitFlex: flexValue,
    }

    if (column.props.maxWidth) {
      style.maxWidth = column.props.maxWidth
    }

    if (column.props.minWidth) {
      style.minWidth = column.props.minWidth
    }

    return style
  }

  headerStyle = memoizeOne((headerHeight, width, scrollbarWidth, rowStyleObject) => ({
    height: headerHeight,
    width: width - scrollbarWidth,
    ...rowStyleObject,
  }))

  render() {
    const {
      children,
      className,
      disableHeader,
      gridClassName,
      gridStyle,
      gridWidth,
      headerHeight,
      headerRowRenderer,
      height,
      id,
      noRowsRenderer,
      rowClassName,
      rowStyle,
      scrollToIndex,
      style,
      width,
    } = this.props
    const { scrollbarWidth } = this.state

    const rowClass = typeof rowClassName === 'function' ? rowClassName({ index: -1 }) : rowClassName
    const rowStyleObject = typeof rowStyle === 'function' ? rowStyle({ index: -1 }) : rowStyle

    // Precompute and cache column styles before rendering rows and columns to speed things up
    this._cachedColumnStyles = []
    React.Children.toArray(children).forEach((column, index) => {
      const flexStyles = this._getFlexStyleForColumn(column, column.props.style)

      this._cachedColumnStyles[index] = {
        ...flexStyles,
        overflow: 'hidden',
      }
    })

    const header = disableHeader
      ? null
      : headerRowRenderer({
          className: cn('ReactVirtualized__Table__headerRow', rowClass, scrollbarWidth ? styles.withScrollbar : ''),
          columns: this._getHeaderColumns(),
          scrollbarWidth,
          style: this.headerStyle(headerHeight, width, scrollbarWidth, rowStyleObject),
        })

    // Note that we specify :rowCount, :scrollbarWidth, :sortBy, and :sortDirection as properties on Grid even though these have nothing to do with Grid.
    // This is done because Grid is a pure component and won't update unless its properties or state has changed.
    // Any property that should trigger a re-render of Grid then is specified here to avoid a stale display.
    return (
      <div
        aria-label={this.props['aria-label']}
        aria-labelledby={this.props['aria-labelledby']}
        aria-colcount={React.Children.toArray(children).length}
        aria-rowcount={this.props.rowCount}
        className={cn('ReactVirtualized__Table', className)}
        id={id}
        role="table"
        style={style}
      >
        <Grid
          {...this.props}
          header={header}
          headerHeight={headerHeight}
          className={cn('ReactVirtualized__Table__Grid', gridClassName)}
          cellRenderer={this._createRow}
          columnWidth={width - scrollbarWidth}
          columnCount={1}
          height={height}
          id={undefined}
          noContentRenderer={noRowsRenderer}
          onScroll={this.props.onScroll}
          onSectionRendered={this._onSectionRendered}
          ref={this._setRef}
          role="rowgroup"
          scrollbarWidth={scrollbarWidth}
          scrollToRow={scrollToIndex}
          style={gridStyle}
          width={gridWidth}
        />
      </div>
    )
  }

  getScrollbarWidth() {
    if (this.Grid) {
      const Grid = this.Grid.scrollingContainer()
      const clientWidth = Grid.clientWidth || 0
      const offsetWidth = Grid.offsetWidth || 0
      return offsetWidth - clientWidth
    }
    return 0
  }

  // Fix for strict mode to not use findDOMNode
  _setScrollbarWidth() {
    if (this.Grid) {
      const scrollbarWidth = this.getScrollbarWidth()
      this.setState({ scrollbarWidth })
    }
  }
}

ScrollingTable.propTypes = {
  ...Table.propTypes,
  gridWidth: PropTypes.number.isRequired,
}

ScrollingTable.defaultProps = Table.defaultProps
