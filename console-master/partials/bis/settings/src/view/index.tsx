import React, { lazy, memo } from 'react'
import type { PartialRouteObject } from 'react-router'
import { Navigate } from 'react-router'
import { useRoutes } from 'react-router-dom'

import { AdaptiveResponseSettings } from '@ues-bis/adaptive-response-settings'
import { GeneralSettings } from '@ues-bis/general-settings'
import { Geozones } from '@ues-bis/geozones'
import { FeatureName, useFeatures } from '@ues-data/shared'
import type { TabRouteObject } from '@ues/behaviours'
import { Loading } from '@ues/behaviours'

const AdaptiveResponseNavigation = lazy(() => import('./settings-navigation'))

export const bisRootTabs: TabRouteObject[] = [
  { ...Geozones, translations: { label: 'navigation:bisSettings.definedGeozones' } },
  { ...AdaptiveResponseSettings, translations: { label: 'navigation:bisSettings.riskConfiguration' } },
  { ...GeneralSettings, translations: { label: 'navigation:bisSettings.generalSettings' } },
]

const UES_ROUTES: PartialRouteObject[] = [
  {
    path: '/settings',
    element: <AdaptiveResponseNavigation />,
    children: [{ path: '/', element: <Navigate to="/settings/geozones" /> }, ...bisRootTabs],
  },
]

const loading = { path: '/loading', element: <Loading /> }
const cronosDisabledRoutes = [loading]

export const UesRoutes = memo(() => {
  const features = useFeatures()
  const isCronos = features.isEnabled(FeatureName.UESCronosNavigation)

  return useRoutes(isCronos ? UES_ROUTES : cronosDisabledRoutes)
})
