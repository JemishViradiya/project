//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { lazy } from 'react'

export { useWidgetsLibrary as useGatewayChartLibrary } from './widgets'

const Dashboard = lazy(() => import('./dashboard'))

export const GatewayDashboard = {
  path: '/dashboard',
  element: <Dashboard />,
}
