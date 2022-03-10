import React, { lazy } from 'react'

import AlertSummary from './widgets/AlertSummary'
import IdentityRiskAlerts from './widgets/IdentityRiskAlerts'
import RealTimeAlerts from './widgets/RealTimeAlerts'
import TopActions from './widgets/TopActions'

export { useWidgetsLibrary as useBisChartLibrary } from './widgets'

const Dashboard = lazy(() => import('./BisDashboard'))

export const BisDashboard = {
  path: '/bis',
  element: <Dashboard />,
}

export const BisDashboardWidgets = {
  AlertSummary,
  IdentityRiskAlerts,
  RealTimeAlerts,
  TopActions,
}

export { BisDashboardWidgetType } from './types'
