import React from 'react'

import type { DashboardProps } from '@ues-behaviour/dashboard'
import { DashboardProvider, getInitialGlobalTime, TimeIntervalId } from '@ues-behaviour/dashboard'
import { HelpLinks } from '@ues/assets'

import DashboardContent from './dashboardContent'
import { BisDashboardWidgetType } from './types'
import { useWidgetsLibrary } from './widgets'

export const BIS_DASHBOARD_CONFIG = {
  id: 'bis-dashboard',
  title: 'BlackBerry Persona Analytics',
  timeIntervalId: TimeIntervalId.Last24Hours,
  widgets: [
    {
      id: BisDashboardWidgetType.IdentityRiskAlerts,
      layout: { w: 12, h: 12, x: 0, y: 0 },
    },
    {
      id: BisDashboardWidgetType.GeozoneRiskAlerts,
      layout: { w: 12, h: 12, x: 12, y: 0 },
    },
    {
      id: BisDashboardWidgetType.AlertSummary,
      layout: { w: 6, h: 7, x: 0, y: 12 },
    },
    {
      id: BisDashboardWidgetType.CombinedRiskAlerts,
      layout: { w: 12, h: 12, x: 6, y: 12 },
    },
    {
      id: BisDashboardWidgetType.TopActions,
      layout: { w: 6, h: 12, x: 18, y: 12 },
    },
    {
      id: BisDashboardWidgetType.RealTimeAlerts,
      layout: { w: 6, h: 12, x: 0, y: 19 },
    },
    {
      id: BisDashboardWidgetType.TotalEvents,
      layout: { w: 6, h: 4, x: 6, y: 31 },
    },
    {
      id: BisDashboardWidgetType.TotalUsers,
      layout: { w: 6, h: 4, x: 12, y: 31 },
    },
    {
      id: BisDashboardWidgetType.Map,
      layout: { w: 12, h: 10, x: 6, y: 40 },
    },
  ],
}

const { layoutState, cardState } = BIS_DASHBOARD_CONFIG.widgets.reduce<{
  layoutState: DashboardProps['layoutState']
  cardState: DashboardProps['cardState']
}>(
  (acc, widget) => ({
    layoutState: [...acc.layoutState, { i: widget.id, ...widget.layout }],
    cardState: {
      ...acc.cardState,
      [widget.id]: { chartId: widget.id },
    },
  }),
  { layoutState: [], cardState: {} },
)

const Dashboard = () => {
  const widgetsLibrary = useWidgetsLibrary()

  return (
    <DashboardProvider
      dashboardProps={{
        cardState,
        chartLibrary: widgetsLibrary,
        globalTime: getInitialGlobalTime(BIS_DASHBOARD_CONFIG.timeIntervalId),
        id: BIS_DASHBOARD_CONFIG.id,
        layoutState,
        title: BIS_DASHBOARD_CONFIG.title,
        nonPersistent: true,
      }}
    >
      <DashboardContent />
    </DashboardProvider>
  )
}
export default Dashboard
