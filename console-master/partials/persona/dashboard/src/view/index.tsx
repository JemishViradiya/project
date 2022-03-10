import React, { lazy } from 'react'
import type { PartialRouteObject } from 'react-router'

const Dashboard = lazy(() => import('./dashboard/dashboard'))

export const PersonaDashboard: PartialRouteObject = {
  path: '/dashboard',
  element: <Dashboard />,
}
