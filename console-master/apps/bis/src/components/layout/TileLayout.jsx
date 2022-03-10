import classNames from 'classnames'
import React from 'react'
import Grid, { Responsive as _Responsive } from 'react-grid-layout'

export { utils, WidthProvider } from 'react-grid-layout'

Grid.prototype.render = function () {
  const { className, style, 'aria-readonly': ariaReadonly, 'data-width': dataWidth, forwardRef } = this.props

  const mergedClassName = classNames('react-grid-layout', className)
  const mergedStyle = {
    height: this.containerHeight(),
    ...style,
  }

  return (
    <div
      className={mergedClassName}
      style={mergedStyle}
      role="grid"
      aria-readonly={ariaReadonly}
      data-width={dataWidth}
      ref={forwardRef}
    >
      {React.Children.map(this.props.children, child => this.processGridItem(child))}
      {this.placeholder()}
    </div>
  )
}

// Disable tree shaking for Responsive without Grid
export const Responsive = Grid && _Responsive

export default Grid
