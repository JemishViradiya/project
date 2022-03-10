import React, { lazy } from 'react'
import type { PartialRouteObject } from 'react-router'

import { ROUTES } from './../../constants'

const DevicePolicyDetails = lazy(() => import('./details'))

const DevicePoliciesDetailsRoutes: PartialRouteObject[] = [
  {
    path: ROUTES.Default,
    element: <DevicePolicyDetails />,
  },
  {
    path: ROUTES.AddPolicy,
    element: <DevicePolicyDetails />,
  },
  {
    path: ROUTES.Details,
    element: <DevicePolicyDetails />,
  },
]

export { DevicePolicyDetails as default, DevicePoliciesDetailsRoutes }
