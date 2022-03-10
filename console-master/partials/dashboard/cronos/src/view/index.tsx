import React from 'react'

const Dashboard = React.lazy(() => import('./dashboard'))
const CustomDashboard = React.lazy(() => import('./CustomDashboard'))

export const CronosDashboard = {
  path: '/dashboard',
  children: [
    { path: '/:dashboardId', element: <CustomDashboard /> },
    { path: '/', element: <Dashboard /> },
  ],
}
