import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import type { CardState, ChartLibrary, TimeIntervalId } from '@ues-behaviour/dashboard'
import {
  AddWidgetsDrawer,
  DashboardActionMenu,
  DashboardHeader,
  DashboardLayout,
  DashboardProvider,
  DrillDownDrawer,
  getInitialGlobalTime,
  TimeSelect,
  useDashboard,
  useDashboardAddActions,
  useGlobalTimeSelect,
} from '@ues-behaviour/dashboard'
import { BasicAddRound } from '@ues/assets'
import { usePageTitle } from '@ues/behaviours'

import { useWidgetsLibrary as useMtdChartLibrary } from './chartLibrary'
import mtdDashboardConfig from './mtdDashboard.json'

const MTDDashboardActions = memo(() => {
  const [addWidgets] = useDashboardAddActions()

  return useMemo(() => {
    return <DashboardActionMenu icon={BasicAddRound}>{[addWidgets]}</DashboardActionMenu>
  }, [addWidgets])
})

const DashboardMain = memo(() => {
  const theme = useTheme()
  const showActions = useMediaQuery(theme.breakpoints.up('md'))
  const { containerProps, addWidgetsDrawerOpen, drillDownOpen, setDrillDownOpen } = useDashboard()

  return (
    <>
      <div {...containerProps}>
        <DashboardHeader widgetDrawerOpen={addWidgetsDrawerOpen}>
          <TimeSelect testid={'globalTime'} {...useGlobalTimeSelect()} />
          {showActions && <MTDDashboardActions />}
        </DashboardHeader>
        <DashboardLayout />
      </div>
      {showActions && <AddWidgetsDrawer />}
      <DrillDownDrawer open={drillDownOpen} setOpen={setDrillDownOpen} />
    </>
  )
})

const DashboardContent = memo(() => {
  const { t } = useTranslation(['mtd/common'])
  usePageTitle('dashboard.title')
  const mtdChartLibrary = useMtdChartLibrary()
  const widgetsLibrary = useMemo(() => Object.assign({}, mtdChartLibrary), [mtdChartLibrary])

  const filterChartLibrary = useMemo(
    () => (widgetsLibrary: ChartLibrary): ChartLibrary => {
      const enabledWidgets = window.localStorage.getItem('EnabledWidgets')

      if (enabledWidgets === null || enabledWidgets.length === 0) {
        return widgetsLibrary
      } else {
        const chartLibrary = {}
        const widgets = enabledWidgets.split(',')
        for (const widget of widgets) {
          chartLibrary[widget] = widgetsLibrary[widget]
        }
        return chartLibrary
      }
    },
    [],
  )

  const { dashboardId: id, layoutState, cardState, globalTime } = mtdDashboardConfig

  const dashboardProps = {
    id: id,
    title: t('dashboard.title'),
    globalTime: getInitialGlobalTime(globalTime as TimeIntervalId, new Date()),
    layoutState: layoutState,
    cardState: cardState as CardState,
    chartLibrary: filterChartLibrary(widgetsLibrary),
    nonPersistent: true,
  }

  return useMemo(
    () => {
      return (
        <DashboardProvider dashboardProps={dashboardProps}>
          <DashboardMain />
        </DashboardProvider>
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      dashboardProps.id,
      dashboardProps.title,
      dashboardProps.globalTime.timeInterval,
      dashboardProps.layoutState,
      dashboardProps.cardState,
      dashboardProps.nonPersistent,
    ], // Need to remove globalTime.nowTime and chartLibrary from dependencies
  )
})

export default DashboardContent
