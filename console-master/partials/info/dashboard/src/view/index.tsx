//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { lazy } from 'react'

export { useWidgetsLibrary as useDlpChartLibrary } from './widgets'

const Dashboard = lazy(() => import('./dashboard'))

export const DlpDashboard = {
  path: '/dashboard',
  element: <Dashboard />,
}
