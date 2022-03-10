import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { DELETED_DASHBOARD_ID } from '@ues-behaviour/dashboard'
import { getDashboardNavIds } from '@ues-data/nav'
import { FeatureName, useFeatures } from '@ues-data/shared'

export const useCustomDashboard = () => {
  let { dashboardId } = useParams()
  const features = useFeatures()
  const nxAppEnabled = features.isEnabled(FeatureName.SingleNXApp)

  const ROUTE_PREFIX = nxAppEnabled ? 'console#/dashboard/' : 'dashboard#/dashboard/'

  const dashboardNavIds = useSelector(getDashboardNavIds(ROUTE_PREFIX))

  // If dashboard id is not provided, navigate to first dashboard
  if (dashboardNavIds && (!dashboardId || dashboardId === DELETED_DASHBOARD_ID)) {
    dashboardId = dashboardNavIds[0]
  }

  useEffect(() => {
    if (dashboardId) {
      if (!window.location.href.includes(DELETED_DASHBOARD_ID) && !window.location.href.endsWith('/' + dashboardId)) {
        window.location.href += '/' + dashboardId
      } else if (window.location.href.includes(DELETED_DASHBOARD_ID)) {
        window.location.href = window.location.href.replace('/' + DELETED_DASHBOARD_ID, '') + '/' + dashboardId
      }
    }
  }, [dashboardId])

  return { dashboardId, dashboardNavIds }
}
