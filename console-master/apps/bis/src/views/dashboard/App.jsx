import cn from 'classnames'
import React, { memo, useRef } from 'react'

import { useTheme } from '@material-ui/core/styles'

import { getHeight, getWidth, useComponentSize } from '@ues-behaviour/react'

import StateProvider from '../../providers/StateProvider'
import { ErrorBoundary, useToggle } from '../../shared'
import styles from './App.module.less'
import AppGrid from './AppGrid'
import Banner from './Banner'

const getGridWidth = (el, currentValue = {}) => {
  // 200px is the width of the sidebar, it defaults to open for now so we can hardcode this
  const width = getWidth(el) || document.documentElement.clientWidth - 200
  const height = getHeight(el)
  const isOverflow = height && height > document.documentElement.clientHeight

  // 44px is the sum of padding in App.less:.home
  // subtract the width of the slider is 29px for chrome
  const gridWidth = width - 44 + (isOverflow ? window.innerWidth - document.documentElement.clientWidth : 0)
  if (gridWidth === currentValue.gridWidth && isOverflow === currentValue.isOverflow) {
    return currentValue
  }
  return { gridWidth, isOverflow }
}

const Content = memo(() => {
  const theme = useTheme()
  const isDarkTheme = theme.palette.type === 'dark'
  const [editMode, toggleEditMode] = useToggle()
  const sizeRef = useRef()
  const { gridWidth, isOverflow } = useComponentSize(sizeRef, getGridWidth)
  const className = cn(styles.home, isOverflow && styles.overflow, isDarkTheme && styles.darkTheme)

  return (
    <div id="main-dashboard" className={className} ref={sizeRef}>
      <Banner editMode={editMode} toggleEditMode={toggleEditMode} />
      <AppGrid editMode={editMode} width={gridWidth} />
    </div>
  )
})

const App = memo(() => {
  return (
    <ErrorBoundary>
      <StateProvider>
        <Content />
      </StateProvider>
    </ErrorBoundary>
  )
})

export default App
