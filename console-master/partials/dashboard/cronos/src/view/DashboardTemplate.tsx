/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useMemo } from 'react'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import type { DashboardProps } from '@ues-behaviour/dashboard'
import {
  AddWidgetsDrawer,
  DashboardActions,
  DashboardHeader,
  DashboardLayout,
  DashboardProvider,
  DEFAULT_DASHBOARD_ID,
  DrillDownDrawer,
  ErrorCode,
  getInitialGlobalTime,
  TimeSelect,
  useDashboard,
  useGlobalTimeSelect,
} from '@ues-behaviour/dashboard'
import type { ChartLibrary } from '@ues-data/dashboard'
import { DEFAULT_TIME_INTERVAL, queryDashboard } from '@ues-data/dashboard'
import { useStatefulApolloQuery } from '@ues-data/shared'

import { useOutOfBoxConfigs } from './outOfBoxConfigs'
import { useWidgetLibrary } from './widgetLibrary'

const getDashboardProps = (id: string, data: unknown, widgetsLibrary: ChartLibrary): DashboardProps => {
  const nowTime = new Date()
  if (data['getDashboard'] === null) {
    const defaultProps = {
      id,
      title: undefined,
      globalTime: getInitialGlobalTime(DEFAULT_TIME_INTERVAL, nowTime),
      cardState: {},
      layoutState: [],
      chartLibrary: widgetsLibrary,
      error: null,
    }
    if (id === DEFAULT_DASHBOARD_ID) {
      console.error('No dashboard to load, fallback to default dashboard')
      // No custom dashboards available in nav, fallback to default dashboard
      return defaultProps
    } else {
      return { ...defaultProps, error: new Error(ErrorCode.DASHBOARD_NOT_FOUND) }
    }
  } else {
    const { __typename, dashboardId, globalTime, ...currentState } = data['getDashboard']
    const timeInterval = globalTime || DEFAULT_TIME_INTERVAL
    const dashboardTime = { timeInterval, nowTime }
    return {
      id: dashboardId,
      chartLibrary: widgetsLibrary,
      globalTime: dashboardTime,
      error: null,
      ...currentState,
    }
  }
}

const DashboardMain = memo(() => {
  const theme = useTheme()
  const showActions = useMediaQuery(theme.breakpoints.up('md'))
  const { containerProps, addWidgetsDrawerOpen, drillDownOpen, setDrillDownOpen } = useDashboard()
  const dashboardConfigs = useOutOfBoxConfigs()

  return (
    <>
      <div {...containerProps}>
        <DashboardHeader widgetDrawerOpen={addWidgetsDrawerOpen}>
          <TimeSelect testid={'globalTime'} {...useGlobalTimeSelect()} />
          {showActions && <DashboardActions outOfBoxConfigs={dashboardConfigs} />}
        </DashboardHeader>
        <DashboardLayout />
      </div>
      {showActions && <AddWidgetsDrawer />}
      <DrillDownDrawer open={drillDownOpen} setOpen={setDrillDownOpen} />
    </>
  )
})

type DashboardTemplateProps = {
  dashboardId: string
}

const DashboardTemplate = memo(({ dashboardId }: DashboardTemplateProps) => {
  const widgetsLibrary = useWidgetLibrary()
  const { loading, data, error } = useStatefulApolloQuery(queryDashboard, {
    fetchPolicy: 'network-only',
    variables: { dashboardId },
  })

  return useMemo(() => {
    if (loading) {
      return null
    }

    if (error) {
      console.error(error.message)
      return null
    }

    const dashboardProps = getDashboardProps(dashboardId, data, widgetsLibrary)
    return (
      <DashboardProvider dashboardProps={dashboardProps}>
        <DashboardMain />
      </DashboardProvider>
    )
  }, [dashboardId, data, error, loading, widgetsLibrary])
})

export default DashboardTemplate

DashboardTemplate.displayName = 'DashboardTemplate'
