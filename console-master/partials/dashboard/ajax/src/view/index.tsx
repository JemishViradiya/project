import React from 'react'

const Dashboard = React.lazy(() => import('./dashboard'))

export const AjaxDashboard = {
  path: '/dashboard',
  element: <Dashboard />,
}
