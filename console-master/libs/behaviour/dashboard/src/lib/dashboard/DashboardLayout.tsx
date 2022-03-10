/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import clsx from 'clsx'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { makeStyles, Typography } from '@material-ui/core'
import type { Theme } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { useResponsiveDrawerState } from '@ues-behaviour/nav-drawer'
import { useScreenSize } from '@ues-behaviour/react'
import { updateDashboardCardAndLayoutMutation, updateDashboardLayoutMutation } from '@ues-data/dashboard'
import { useFeatures, useStatefulApolloMutation } from '@ues-data/shared'
import { imageChartEmpty } from '@ues/assets'

import { cardBorder, DashboardCard } from './card/DashboardCard'
import { useDashboardLayout, useDashboardWidgets } from './DashboardProvider'
import { addNewCard, selectCardState, selectChartLibrary, selectEditable, selectLayoutState, updateLayout } from './store'
import { DRAWER_WIDTH, getXSLayout } from './utils'
import type { Layout, ResponsiveProps } from './widgets/GridLayout'
import { Responsive } from './widgets/GridLayout'

const cardLayoutOffset = (editable: boolean) => 2 * cardBorder(editable)

// clients can send this message to tell us to reset our layout.
const RESET_LAYOUT_EVENT = 'ResetDashboardLayout'
export const resetToDefaultLayout = (): void => {
  document.dispatchEvent(new CustomEvent(RESET_LAYOUT_EVENT))
}

const useStyles = makeStyles(theme => ({
  grid: {
    textAlign: 'initial',
    flex: '1 0 auto',
    padding: '2px !important',
    transition: 'none !important',
    '&$noTransition > .MuiCard-root': {
      transition: ([
        theme.transitions.create(['border', 'box-shadow']),
        '!important',
      ] as unknown) as React.CSSProperties['transition'],
    },
  },
  noTransition: {},
  placeHolderContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  placeHolderImage: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(6),
  },
}))

const cols = {
  sm: 24,
  xs: 1,
}

const breakpoints = {
  sm: 600,
  xs: 0,
}

/**
 * Stop transitions during window resize and mount
 */
const useNoTransition = windowSize => {
  const [noTransition, setNoTransition] = useState(true)
  const previous = useRef(-1)
  const clear = useRef<ReturnType<typeof setTimeout>>()
  const update = (!noTransition && windowSize !== previous.current) || previous.current === -1
  useEffect(() => {
    if (update) {
      previous.current = windowSize
      clearTimeout(clear.current)
      setNoTransition(true)
      clear.current = setTimeout(() => {
        setNoTransition(false)
      }, 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update])
  return noTransition
}

const useDashboardDefaultLayoutWidth = (windowSize, isOpen: boolean, theme: Theme) => {
  const { width: drawerWidth } = useResponsiveDrawerState()
  const addWidgetsDrawerWidth = isOpen ? DRAWER_WIDTH : 0
  return windowSize - drawerWidth - addWidgetsDrawerWidth - theme.spacing(1)
}

const PlaceHolder = () => {
  const { t } = useTranslation(['dashboard'])
  const styles = useStyles()
  const { setAddWidgetsDrawerOpen } = useDashboardWidgets()

  useEffect(() => {
    setAddWidgetsDrawerOpen(true)
  }, [setAddWidgetsDrawerOpen])

  return (
    <div className={styles.placeHolderContainer}>
      <div className={styles.placeHolderImage}>
        <img src={imageChartEmpty} alt={t('placeHolderMessage')} />
      </div>
      <Typography variant="caption" align="center">
        {t('placeHolderMessage')}
      </Typography>
    </div>
  )
}

export interface DashboardLayoutProps {
  calculateWidth?: (windowSize: number, isOpen: boolean, theme: Theme) => number
}

export const DashboardLayout = memo(({ calculateWidth = useDashboardDefaultLayoutWidth }: DashboardLayoutProps) => {
  const theme = useTheme()
  const styles = useStyles()
  const editable = useSelector(selectEditable)

  const layoutState = useSelector(selectLayoutState)
  const cardState = useSelector(selectCardState)
  const chartLibrary = useSelector(selectChartLibrary)
  const { isEnabled } = useFeatures()

  const dispatch = useDispatch()

  const cardLayouts = useMemo(
    () => ({
      sm: layoutState,
      xs: getXSLayout(layoutState),
    }),
    [layoutState],
  )

  const layoutProps = useDashboardLayout()
  const currentBreakpoint = layoutProps.breakpoint === 'xs' ? 'xs' : 'sm'
  const containerPadding: [number, number] = [layoutProps.padding, cardBorder(editable) + theme.spacing(6)]
  const margin: ResponsiveProps['margin'] = [layoutProps.margin, layoutProps.margin]
  const rowHeight = layoutProps.rowHeight

  const { addWidgetsDrawerOpen, droppingItem } = useDashboardWidgets()

  const windowSize = useScreenSize(window => window.innerWidth)
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  const dashboardEditable = editable && matches
  const width = calculateWidth(windowSize, addWidgetsDrawerOpen && dashboardEditable, theme) + cardLayoutOffset(editable)
  const noTransition = useNoTransition(windowSize)

  // whenever we receive a new layout need to rerender --> we use an incrementing key to
  // ensure that <Responsive> will be rebuilt (and not ignore the new layout in its props)
  const [renderKey, setRenderKey] = useState(0)

  // this is how other components can tell us to reset our layout
  useEffect(() => {
    const documentListener = () => {
      setRenderKey(renderKey => renderKey + 1)
    }
    document.addEventListener(RESET_LAYOUT_EVENT, documentListener)
    return () => {
      document.removeEventListener(RESET_LAYOUT_EVENT, documentListener)
    }
  }, [setRenderKey])

  const [updateLayoutFn] = useStatefulApolloMutation(updateDashboardLayoutMutation, {
    onError: error => console.error(error.message),
    variables: { dashboardId: '' },
  })

  const [addNewCardFn] = useStatefulApolloMutation(updateDashboardCardAndLayoutMutation, {
    onError: error => console.error(error.message),
    variables: { dashboardId: '' },
  })

  /**
   * Do when widgets are dropped into the grid from outside.
   */
  const onDrop = useCallback(
    (layout, layoutItem, event) => {
      const chartId = event.dataTransfer.getData('text/plain')
      const cardId = chartId + '_' + new Date().getTime()
      dispatch(
        addNewCard({
          cardInfo: {
            id: cardId,
            chartId: chartId,
            layout: layout,
            x: layoutItem.x,
            y: layoutItem.y,
          },
          updateFn: addNewCardFn,
        }),
      )
    },
    [addNewCardFn, dispatch],
  )

  /**
   * Do when widget move/rearrangement is complete.
   */
  const onDragStop = useCallback(
    (layoutState: Layout[]) => {
      dispatch(updateLayout({ layoutState, updateFn: updateLayoutFn }))
    },
    [dispatch, updateLayoutFn],
  )

  const onDragStart = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => {
      const ev = document.createEvent('DragEvent')
      ev.initEvent('dragstart', true, false)
      element.dispatchEvent(ev)
    },
    [],
  )

  /**
   * Do when widget resize is complete.
   */
  const onResizeStop = onDragStop

  const renderCard = ({ i: key }) => {
    const chartId = cardState[key].chartId
    if (!chartLibrary[chartId]) return null

    const { title, chartType, showCardTitle, features, permissions, services, component: ChildComponent } = chartLibrary[chartId]
    const shouldRender = typeof features === 'undefined' || features(isEnabled)
    if (!shouldRender) return null

    return (
      <DashboardCard
        key={key}
        id={key}
        chartId={chartId}
        titleText={title}
        chartType={chartType}
        showCardTitle={showCardTitle}
        permissions={permissions}
        services={services}
        child={ChildComponent}
        role="gridcell"
        editable={dashboardEditable}
      />
    )
  }

  const renderCards = () =>
    cardLayouts?.[currentBreakpoint]
      .filter(item => cardState[item.i])
      .map(renderCard)
      .filter(card => card != null)

  return (
    <>
      {!layoutState.length && dashboardEditable && <PlaceHolder />}
      <Responsive
        component="main"
        key={renderKey}
        width={width}
        className={clsx(styles.grid, noTransition ? styles.noTransition : '')}
        layouts={cardLayouts}
        breakpoint={currentBreakpoint}
        breakpoints={breakpoints}
        cols={cols}
        margin={margin}
        containerPadding={containerPadding}
        rowHeight={rowHeight}
        draggableCancel=".nodrag"
        draggableHandle=".draghandle"
        isBounded={true}
        isResizable={dashboardEditable}
        isDraggable={dashboardEditable}
        isDroppable={dashboardEditable}
        onResizeStop={onResizeStop}
        onDragStop={onDragStop}
        onDragStart={onDragStart}
        onDrop={onDrop}
        droppingItem={droppingItem}
        measureBeforeMount={false}
        useCSSTransforms
      >
        {renderCards()}
      </Responsive>
    </>
  )
})
