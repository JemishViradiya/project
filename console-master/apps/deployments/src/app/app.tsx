import React, { memo } from 'react'
import { useRoutes } from 'react-router-dom'

import { FeatureName, useFeatures } from '@ues-data/shared'
import { DeploymentsRoutes } from '@ues-protect/deployments'
import { Loading } from '@ues/behaviours'

const loading = { path: '/loading', element: <Loading /> }

const ajaxRoutes = [loading]
const cronosRoutes = [loading, DeploymentsRoutes]

export const AppRoutes = memo(() => {
  const features = useFeatures()
  const cronosNavigation = features.isEnabled(FeatureName.UESCronosNavigation)

  return useRoutes(cronosNavigation ? cronosRoutes : ajaxRoutes)
})

export default <AppRoutes />
