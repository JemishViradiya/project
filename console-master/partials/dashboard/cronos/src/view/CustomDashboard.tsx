import React, { memo, useMemo } from 'react'

import DashboardTemplate from './DashboardTemplate'
import DefaultDashboard from './DefaultDashboard'
import { useCustomDashboard } from './useCustomDashboard'

const CustomDashboard = memo(() => {
  const { dashboardId, dashboardNavIds } = useCustomDashboard()

  return useMemo(() => {
    if (!dashboardNavIds) {
      return null
    }

    // No custom dashboards available in nav & no dashboardId, fallback to default dashboard
    if (!dashboardId) {
      return <DefaultDashboard />
    }

    return <DashboardTemplate dashboardId={dashboardId} />
  }, [dashboardId, dashboardNavIds])
})

export default CustomDashboard
