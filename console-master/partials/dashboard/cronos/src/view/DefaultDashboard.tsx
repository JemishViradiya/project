//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useMemo } from 'react'

import { DashboardProvider, DEFAULT_DASHBOARD_ID } from '@ues-behaviour/dashboard'

import DashboardContent from './dashboard-content'
import { useOutOfBoxConfigs } from './outOfBoxConfigs'
import { useWidgetLibrary } from './widgetLibrary'

const DefaultDashboard: React.FC = () => {
  const widgetsLibrary = useWidgetLibrary()
  const dashboardConfigs = useOutOfBoxConfigs()

  return useMemo(() => {
    if (dashboardConfigs === undefined) return null
    const networkDashboardConfig = dashboardConfigs.filter(config => config.id === 'networkDashboard')[0]
    const { layoutState, cardState, globalTime, title } = networkDashboardConfig
    return (
      <DashboardProvider
        dashboardProps={{
          cardState,
          chartLibrary: widgetsLibrary,
          globalTime,
          id: DEFAULT_DASHBOARD_ID,
          layoutState,
          title,
        }}
      >
        <DashboardContent />
      </DashboardProvider>
    )
  }, [dashboardConfigs, widgetsLibrary])
}

export default DefaultDashboard
