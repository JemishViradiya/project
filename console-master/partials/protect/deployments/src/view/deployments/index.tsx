import React from 'react'
import type { PartialRouteObject } from 'react-router'

import { ROUTES } from '../../constants'

const Deployments = React.lazy(() => import('./deployments'))
const DeploymentsView = React.lazy(() => import('./deploymentsView'))

export const DeploymentsViewRoutes: PartialRouteObject = {
  path: ROUTES.DEFAULT,
  children: [{ path: '/', element: <DeploymentsView /> }],
}

export const DeploymentsRoutes: PartialRouteObject = {
  path: ROUTES.DEFAULT,
  children: [{ path: '/', element: <Deployments /> }],
}
