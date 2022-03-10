import React from 'react'

export { getChartLibrary } from './protect/chartLibrary'

const Dashboard = React.lazy(() => import('./ProtectDashboard'))

export const ProtectDashboard = { path: '/protect', element: <Dashboard /> }
