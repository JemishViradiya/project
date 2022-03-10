/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import classNames from 'classnames'
import React from 'react'
import type { CoreProps, Layout, Layouts } from 'react-grid-layout'
import { default as Grid, Responsive as _Responsive, utils } from 'react-grid-layout'

export type { Layout, Layouts } from 'react-grid-layout'

export interface ResponsiveProps extends CoreProps {
  forwardRef?: React.Ref<HTMLElement>
  component?: React.ElementType
  breakpoint?: string
  measureBeforeMount?: boolean
  breakpoints?: { [P: string]: number }
  cols?: { [P: string]: number }
  margin?: [number, number] | { [P: string]: [number, number] }
  containerPadding?: [number, number] | { [P: string]: [number, number] }
  layouts?: Layouts
  onBreakpointChange?(newBreakpoint: string, newCols: number): void
  onLayoutChange?(currentLayout: Layout[], allLayouts: Layouts): void
  onWidthChange?(containerWidth: number, margin: [number, number], cols: number, containerPadding: [number, number]): void
}

declare module 'react-grid-layout' {
  const utils: {
    noop: () => void
  }
  interface ResponsiveProps extends CoreProps {
    forwardRef?: React.Ref<HTMLElement>
    component?: React.ElementType
    breakpoint?: string
    measureBeforeMount?: boolean
    breakpoints?: { [P: string]: number }
    cols?: { [P: string]: number }
    margin?: [number, number] | { [P: string]: [number, number] }
    containerPadding?: [number, number] | { [P: string]: [number, number] }
    layouts?: Layouts
    onBreakpointChange?(newBreakpoint: string, newCols: number): void
    onLayoutChange?(currentLayout: Layout[], allLayouts: Layouts): void
    onWidthChange?(containerWidth: number, margin: [number, number], cols: number, containerPadding: [number, number]): void
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  class Responsive extends React.Component<ResponsiveProps> {}
}

export { utils, WidthProvider } from 'react-grid-layout'

Grid.prototype.render = function () {
  const {
    className,
    style,
    'aria-readonly': ariaReadonly,
    'data-width': dataWidth,
    forwardRef,
    isDroppable,
    component: Component = 'div',
  } = this.props

  const mergedClassName = classNames('react-grid-layout', className)
  const mergedStyle = {
    height: this.containerHeight(),
    ...style,
  }

  // Custom onDrop is needed to add (drad and drop) new charts in FireFox
  const onDropCustom = e => {
    e.preventDefault()
    this.onDrop(e)
  }

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <Component
      className={mergedClassName}
      style={mergedStyle}
      role="grid"
      aria-readonly={ariaReadonly}
      data-width={dataWidth}
      ref={forwardRef}
      onDrop={isDroppable ? onDropCustom : utils.noop}
      onDragLeave={isDroppable ? this.onDragLeave : utils.noop}
      onDragEnter={isDroppable ? this.onDragEnter : utils.noop}
      onDragOver={isDroppable ? this.onDragOver : utils.noop}
    >
      {React.Children.map(this.props.children, child => this.processGridItem(child))}
      {isDroppable && this.state.droppingDOMNode && this.processGridItem(this.state.droppingDOMNode, true)}
      {this.placeholder()}
    </Component>
  )
}

// Disable tree shaking for Responsive without Grid
export const Responsive = Grid && _Responsive

export const GridLayout = Grid

export default Grid
