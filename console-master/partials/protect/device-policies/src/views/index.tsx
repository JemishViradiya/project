import React from 'react'
import type { PartialRouteObject } from 'react-router'

import { ROUTES } from './../constants'
import DevicePolicyDetails, { DevicePoliciesDetailsRoutes } from './details'
import DevicePolicyList, { DevicePoliciesListRoutes } from './list'

const DevicePoliciesRoutes: PartialRouteObject[] = [
  {
    path: ROUTES.Default,
    element: <DevicePolicyList />,
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

export { DevicePoliciesRoutes, DevicePoliciesListRoutes, DevicePoliciesDetailsRoutes }
