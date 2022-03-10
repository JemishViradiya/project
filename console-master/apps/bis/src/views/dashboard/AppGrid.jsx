import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import PropTypes from 'prop-types'
import React, { memo, useCallback, useEffect, useReducer, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { BehaviorRiskLine } from '../../charts/BehaviorRiskLine'
import EventCounter from '../../charts/EventCounter'
import { GeozoneRiskLine } from '../../charts/GeozoneRiskLine'
import LatestEvents from '../../charts/LatestEvents'
import MapChart from '../../charts/MapChart'
import RiskSummary from '../../charts/RiskSummary'
import TopActions from '../../charts/TopActions'
import UserCounter from '../../charts/UserCounter'
import { ResponsiveTileLayout as Responsive, Tile } from '../../shared'
import styles from './AppGrid.module.less'

export const LayoutsKey = 'TileLayouts_V2'

const ids = {
  totalUsers: 'totalUsers',
  totalEvents: 'totalEvents',
  risk: 'risk',
  critical: 'critical',
  top: 'top',
  behaviorLine: 'behaviorLine',
  geozoneLine: 'geozoneLine',
  map: 'map',
  actions: 'actions',
}

const defaultLayouts = {
  lg: [
    { i: 'map', x: 1, y: 0, w: 3, h: 4, minW: 3, minH: 3 },
    { i: 'totalUsers', x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
    { i: 'totalEvents', x: 4, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
    { i: 'risk', x: 0, y: 3, w: 1, h: 3, minW: 1, minH: 2 },
    { i: 'top', x: 0, y: 1, w: 1, h: 2, minW: 1, minH: 2 },
    { i: 'geozoneLine', x: 1, y: 4, w: 2, h: 2, minW: 1, minH: 2 },
    { i: 'behaviorLine', x: 3, y: 4, w: 2, h: 2, minW: 1, minH: 2 },
    { i: 'critical', x: 4, y: 1, w: 1, h: 3, minW: 1, minH: 2 },
  ],
  md: [
    { i: 'map', x: 1, y: 0, w: 3, h: 4, minW: 3, minH: 3 },
    { i: 'totalUsers', x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
    { i: 'totalEvents', x: 0, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
    { i: 'risk', x: 0, y: 4, w: 1, h: 2, minW: 1, minH: 2 },
    { i: 'top', x: 0, y: 2, w: 1, h: 2, minW: 1, minH: 2 },
    { i: 'geozoneLine', x: 1, y: 4, w: 2, h: 2, minW: 1, minH: 2 },
    { i: 'behaviorLine', x: 1, y: 6, w: 2, h: 2, minW: 1, minH: 2 },
    { i: 'critical', x: 3, y: 4, w: 1, h: 4, minW: 1, minH: 2 },
  ],
  sm: [
    { i: 'map', x: 0, y: 2, w: 3, h: 4, minW: 3, minH: 3 },
    { i: 'totalUsers', x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
    { i: 'totalEvents', x: 0, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
    { i: 'risk', x: 2, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { i: 'top', x: 1, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { i: 'geozoneLine', x: 0, y: 6, w: 2, h: 2, minW: 1, minH: 2 },
    { i: 'behaviorLine', x: 0, y: 8, w: 2, h: 2, minW: 1, minH: 2 },
    { i: 'critical', x: 2, y: 6, w: 1, h: 4, minW: 1, minH: 2 },
  ],
  xs: [
    { i: 'map', x: 0, y: 1, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'totalUsers', x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
    { i: 'totalEvents', x: 1, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
    { i: 'risk', x: 0, y: 7, w: 1, h: 2, minW: 1, minH: 2 },
    { i: 'top', x: 0, y: 5, w: 1, h: 2, minW: 1, minH: 2 },
    { i: 'geozoneLine', x: 0, y: 9, w: 2, h: 2, minW: 1, minH: 2 },
    { i: 'behaviorLine', x: 0, y: 11, w: 2, h: 2, minW: 1, minH: 2 },
    { i: 'critical', x: 1, y: 5, w: 1, h: 4, minW: 1, minH: 2 },
  ],
  xxs: [
    { i: 'map', x: 0, y: 0, w: 1, h: 2 },
    { i: 'totalUsers', x: 0, y: 2, w: 1, h: 1 },
    { i: 'totalEvents', x: 0, y: 3, w: 1, h: 1 },
    { i: 'risk', x: 0, y: 4, w: 1, h: 2 },
    { i: 'top', x: 0, y: 6, w: 1, h: 2 },
    { i: 'geozoneLine', x: 0, y: 8, w: 1, h: 2 },
    { i: 'behaviorLine', x: 0, y: 10, w: 1, h: 2 },
    { i: 'critical', x: 0, y: 12, w: 1, h: 3 },
  ],
  xl: [
    { i: 'map', x: 1, y: 0, w: 4, h: 5, minW: 3, minH: 3 },
    { i: 'totalUsers', x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
    { i: 'totalEvents', x: 5, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
    { i: 'risk', x: 0, y: 3, w: 1, h: 2, minW: 1, minH: 2 },
    { i: 'top', x: 0, y: 1, w: 1, h: 2, minW: 1, minH: 2 },
    { i: 'geozoneLine', x: 0, y: 5, w: 3, h: 2, minW: 1, minH: 2 },
    { i: 'behaviorLine', x: 3, y: 5, w: 3, h: 2, minW: 1, minH: 2 },
    { i: 'critical', x: 5, y: 1, w: 1, h: 4, minW: 1, minH: 2 },
  ],
  xxl: [
    { i: 'map', x: 2, y: 0, w: 6, h: 7, minW: 3, minH: 3 },
    { i: 'totalUsers', x: 0, y: 0, w: 2, h: 1, minW: 1, minH: 1 },
    { i: 'totalEvents', x: 8, y: 0, w: 2, h: 1, minW: 1, minH: 1 },
    { i: 'risk', x: 0, y: 3, w: 2, h: 3, minW: 1, minH: 2 },
    { i: 'top', x: 0, y: 1, w: 2, h: 3, minW: 1, minH: 2 },
    { i: 'geozoneLine', x: 0, y: 5, w: 5, h: 3, minW: 1, minH: 2 },
    { i: 'behaviorLine', x: 5, y: 5, w: 5, h: 3, minW: 1, minH: 2 },
    { i: 'critical', x: 8, y: 1, w: 2, h: 6, minW: 1, minH: 2 },
  ],
  xxxl: [
    { i: 'map', x: 3, y: 0, w: 14, h: 12, minW: 3, minH: 3 },
    { i: 'totalUsers', x: 0, y: 0, w: 3, h: 2, minW: 1, minH: 1 },
    { i: 'totalEvents', x: 17, y: 0, w: 3, h: 2, minW: 1, minH: 1 },
    { i: 'risk', x: 0, y: 7, w: 3, h: 5, minW: 1, minH: 2 },
    { i: 'top', x: 0, y: 2, w: 3, h: 5, minW: 1, minH: 2 },
    { i: 'geozoneLine', x: 0, y: 12, w: 10, h: 4, minW: 1, minH: 2 },
    { i: 'behaviorLine', x: 10, y: 12, w: 10, h: 4, minW: 1, minH: 2 },
    { i: 'critical', x: 17, y: 2, w: 3, h: 10, minW: 1, minH: 2 },
  ],
}

const gridItems = {
  [ids.totalUsers]: ['dashboard.activeUsers', '/users', UserCounter],
  [ids.totalEvents]: ['dashboard.totalEvents', '/events', EventCounter],
  [ids.risk]: ['dashboard.riskSummary', '/events', RiskSummary],
  [ids.map]: ['common.map', '/events', MapChart],
  [ids.top]: ['dashboard.topAssignedActions', '/events', TopActions],
  [ids.geozoneLine]: ['common.geozoneRisk', '/events', GeozoneRiskLine, 'common.assessmentOfRiskBasedOnUserProximity'],
  [ids.behaviorLine]: [
    'risk.common.identityRisk',
    '/events',
    BehaviorRiskLine,
    'common.assessmentOfRiskBasedOnUserTypicalActivities',
  ],
  [ids.critical]: ['dashboard.latestEvents', '/events', LatestEvents],
}

const breakpoints = {
  /* vl: 2030, ivl: 2070, */
  xxxl: 2850,
  xxl: 1960,
  xl: 1380,
  lg: 1150,
  md: 920,
  sm: 690,
  xs: 460,
  xxs: 230,
  xxxs: 0,
}
const cols = { /* vl: 10, ivl: 9, */ xxxl: 20, xxl: 10, xl: 6, lg: 5, md: 4, sm: 3, xs: 2, xxs: 1, xxxs: 1 }
const margin = [10, 10]
const initialStyle = { width: '100%' }

const cleanLayoutItem = ({ i, x, y, w, h, minW, minH }) => ({ i, x, y, w, h, minW, minH })

// clients can send this message to tell us to reset our layout.
const RESET_LAYOUT_EVENT = 'ResetAppGridLayout'
export const resetToDefaultLayout = () => {
  document.dispatchEvent(new CustomEvent(RESET_LAYOUT_EVENT))
}

const AppGrid = memo(({ width, editMode }) => {
  const { t } = useTranslation()

  const localRef = useRef({})

  const onLayoutChange = useCallback(
    (_, layouts) => {
      localRef.current.layouts = layouts
      // save the new layout to localStorage
      const clean = {}
      Object.keys(layouts).forEach(l => {
        clean[l] = layouts[l].map(cleanLayoutItem)
      })
      localStorage.setItem(LayoutsKey, JSON.stringify(clean))
    },
    [localRef],
  )

  const initial = !localRef.current.layouts
  if (initial) {
    const storageLayouts = localStorage.getItem(LayoutsKey)
    localRef.current.layouts = storageLayouts ? JSON.parse(storageLayouts) : defaultLayouts
  }

  // whenever we receive a new layout from localStorage externally, we
  // need to rerender --> we use an incrementing key to ensure that
  // <Responsive> will be rebuilt (and not ignore the new layout in its props)
  const incRenderKey = renderKey => renderKey + 1
  const [renderKey, rerender] = useReducer(incRenderKey, 0)

  // this is how other components can tell us to reset our layout
  useEffect(() => {
    const documentListener = () => {
      // no need to restore a default if there's one already
      if (localStorage.getItem(LayoutsKey) === null) return

      localStorage.removeItem(LayoutsKey)
      localRef.current.layouts = defaultLayouts
      rerender()
    }
    document.addEventListener(RESET_LAYOUT_EVENT, documentListener)
    return () => {
      document.removeEventListener(RESET_LAYOUT_EVENT, documentListener)
    }
  }, [rerender, localRef])

  // if some other window has modified local storage, here's how we find out
  useEffect(() => {
    const windowListener = ({ key, oldValue, newValue, storageArea }) => {
      if (storageArea !== localStorage) return
      if (key !== LayoutsKey) return
      if (oldValue === newValue) return
      const storageLayouts = localStorage.getItem(LayoutsKey)
      localRef.current.layouts = storageLayouts ? JSON.parse(storageLayouts) : defaultLayouts
      rerender()
    }
    window.addEventListener('storage', windowListener)
    return () => {
      window.removeEventListener('storage', windowListener)
    }
  }, [rerender, localRef])

  const renderTile = ({ i: key }) => {
    const [title, link, ChartComponent, helpText] = gridItems[key]
    return (
      <Tile
        key={key}
        link={link}
        titleText={t(title)}
        helpText={helpText ? t(helpText) : null}
        child={ChartComponent}
        editMode={editMode}
        role="gridcell"
      />
    )
  }

  return (
    <Responsive
      key={`${renderKey}`}
      width={width || 0}
      className={styles.grid}
      layouts={localRef.current.layouts}
      breakpoints={breakpoints}
      cols={cols}
      margin={margin}
      rowHeight={110}
      onLayoutChange={onLayoutChange}
      draggableCancel=".nodrag"
      isDraggable
      isResizable
      style={width ? undefined : initialStyle}
      aria-readonly={!editMode}
    >
      {width ? defaultLayouts.lg.map(renderTile) : null}
    </Responsive>
  )
})

AppGrid.propTypes = {
  editMode: PropTypes.bool,
  width: PropTypes.number.isRequired,
}

AppGrid.displayName = 'AppGrid'
export default AppGrid
