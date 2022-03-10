import React, { lazy } from 'react'
import type { PartialRouteObject } from 'react-router'

import { ROUTES } from './../../constants'

const DevicePolicyList = lazy(() => import('./list'))

const DevicePoliciesListRoutes: PartialRouteObject[] = [
  {
    path: ROUTES.Default,
    element: <DevicePolicyList />,
  },
]

export { DevicePolicyList as default, DevicePoliciesListRoutes }
