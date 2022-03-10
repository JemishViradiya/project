import cn from 'classnames'
import memoizeOne from 'memoize-one'
import React from 'react'
import shallowEqual from 'react-redux/lib/utils/shallowEqual'
import { Grid as BaseGrid } from 'react-virtualized'

const mergeStyles = () => memoizeOne((a, b) => ({ ...a, ...b }), shallowEqual)

export default class Grid extends BaseGrid {
  mergeGridStyles = mergeStyles()
  mergeScrollContainerStyles = mergeStyles()

  // expose our internal ref for Table to avoid findDOMNode
  scrollingContainer() {
    return this._scrollingContainer
  }

  render() {
    const {
      autoContainerWidth,
      autoHeight,
      autoWidth,
      className,
      containerProps,
      containerRole,
      containerStyle,
      header,
      headerHeight = 0,
      height,
      id,
      noContentRenderer,
      role,
      style,
      tabIndex,
      width,
    } = this.props
    const { instanceProps, needToResetStyleCache } = this.state

    const isScrolling = this._isScrolling()

    const gridStyle = {
      boxSizing: 'border-box',
      direction: 'ltr',
      height: autoHeight ? 'auto' : height,
      position: 'relative',
      width: autoWidth ? 'auto' : width,
      WebkitOverflowScrolling: 'touch',
      willChange: 'transform',
    }

    if (needToResetStyleCache) {
      this._styleCache = {}
    }

    // calculate _styleCache here
    // if state.isScrolling (not from _isScrolling) then reset
    if (!this.state.isScrolling) {
      this._resetStyleCache()
    }

    // calculate children to render here
    this._calculateChildrenToRender(this.props, this.state)

    const totalColumnsWidth = instanceProps.columnSizeAndPositionManager.getTotalSize()
    const totalRowsHeight = instanceProps.rowSizeAndPositionManager.getTotalSize()

    // Force browser to hide scrollbars when we know they aren't necessary.
    // Otherwise once scrollbars appear they may not disappear again.
    // For more info see issue #116
    const verticalScrollBarSize = totalRowsHeight > height ? instanceProps.scrollbarSize : 0
    const horizontalScrollBarSize = totalColumnsWidth > width ? instanceProps.scrollbarSize : 0

    if (horizontalScrollBarSize !== this._horizontalScrollBarSize || verticalScrollBarSize !== this._verticalScrollBarSize) {
      this._horizontalScrollBarSize = horizontalScrollBarSize
      this._verticalScrollBarSize = verticalScrollBarSize
      this._scrollbarPresenceChanged = true
    }

    // Also explicitly init styles to 'auto' if scrollbars are required.
    // This works around an obscure edge case where external CSS styles have not yet been loaded,
    // But an initial scroll index of offset is set as an external prop.
    // Without this style, Grid would render the correct range of cells but would NOT update its internal offset.
    // This was originally reported via clauderic/react-infinite-calendar/issues/23
    gridStyle.overflowX = totalColumnsWidth + verticalScrollBarSize <= width ? 'hidden' : 'auto'
    gridStyle.overflowY = totalRowsHeight + headerHeight + horizontalScrollBarSize <= height ? 'hidden' : 'auto'

    const childrenToDisplay = this._childrenToDisplay

    const showNoContentRenderer = childrenToDisplay.length === 0 && height > 0 && width > 0

    return (
      <div
        ref={this._setScrollingContainerRef}
        {...containerProps}
        aria-label={this.props['aria-label']}
        aria-readonly={this.props['aria-readonly']}
        className={cn('ReactVirtualized__Grid', className)}
        id={id}
        onScroll={this._onScroll}
        role={role}
        style={this.mergeGridStyles(gridStyle, style)}
        tabIndex={tabIndex}
      >
        {header}
        {childrenToDisplay.length > 0 && (
          <div
            className="ReactVirtualized__Grid__innerScrollContainer"
            role={containerRole}
            style={this.mergeScrollContainerStyles(
              {
                width: autoContainerWidth ? 'auto' : totalColumnsWidth,
                height: totalRowsHeight,
                maxWidth: totalColumnsWidth,
                maxHeight: totalRowsHeight,
                overflow: 'visible',
                pointerEvents: isScrolling ? 'none' : '',
                position: 'relative',
              },
              containerStyle,
            )}
          >
            {childrenToDisplay}
          </div>
        )}
        {showNoContentRenderer && noContentRenderer()}
      </div>
    )
  }
}
