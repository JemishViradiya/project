import React, { lazy } from 'react'
import type { PartialRouteObject } from 'react-router'

import { FeatureName } from '@ues-data/shared-types'

const Evidence = lazy(() => import('./evidence'))

export const GatewayEvidence: PartialRouteObject = {
  path: '/event-details/:id',
  element: <Evidence />,
}

export const GatewayEvidenceAlertsTransition: PartialRouteObject = {
  path: '/event-details/:id',
  element: <Evidence features={[FeatureName.UESNavigationGatewayAlertsTransition]} />,
}
