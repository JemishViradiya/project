import React, { memo } from 'react'
import type { PartialRouteObject } from 'react-router'
import { Navigate } from 'react-router'
import { useRoutes } from 'react-router-dom'

import { FeatureName, useFeatures } from '@ues-data/shared'
import { PersonaDashboard } from '@ues-persona/dashboard'
import { PersonaUsers } from '@ues-persona/users'
import { Loading } from '@ues/behaviours'

const loading: PartialRouteObject = { path: '/loading', element: <Loading /> }
const dashboardFallback: PartialRouteObject = { path: '/*', element: <Navigate to="/dashboard" /> }

const ajaxRoutes = [loading]

export const AppRoutes = memo(() => {
  const features = useFeatures()
  const cronosNavigation = features.isEnabled(FeatureName.UESCronosNavigation)
  const personaUsersEnabled = features.isEnabled(FeatureName.UESPersonaUsers)
  const personaDashboardEnabled = features.isEnabled(FeatureName.UESPersonaDashboard)

  let cronosRoutes = [loading]

  if (personaUsersEnabled) {
    cronosRoutes = [...cronosRoutes, PersonaUsers]
  }

  if (personaDashboardEnabled) {
    cronosRoutes = [...cronosRoutes, PersonaDashboard, dashboardFallback]
  }

  return useRoutes(cronosNavigation ? cronosRoutes : ajaxRoutes)
})

export default <AppRoutes />
