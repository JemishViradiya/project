import React, { memo, useEffect } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import { FeatureName, useFeatures } from '@ues-data/shared'
import { Loading } from '@ues/behaviours'

import { GatewaySettingsRoutes } from '../views/'

const loading = { path: '/loading', element: <Loading /> }
const fallback = { path: '/*', element: <Navigate to="/settings" /> }

const AppRoutes = memo(() => {
  const features = useFeatures()
  const cronosNavigation = features.isEnabled(FeatureName.UESCronosNavigation)

  const routes = useRoutes([loading, ...GatewaySettingsRoutes, fallback])

  // Check if cronos and re-route the network settings
  useEffect(() => {
    if (cronosNavigation) {
      const url = new URL(window.location.href)
      Object.assign(url, {
        pathname: url.pathname.replace('/uc/gateway-settings', '/uc/console'),
        hash: url.hash.replace(`#/settings/`, `#/settings/network/`),
      })
      window.location.replace(url.toString())
    }
  }, [cronosNavigation])

  if (cronosNavigation) {
    return <Loading />
  }

  return <main style={{ padding: 0 }}>{routes}</main>
})

export default <AppRoutes />
