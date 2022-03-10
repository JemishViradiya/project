import React, { lazy } from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'

const NetworkEvents = lazy(() => import('./network-events'))

const BaseRoute: UCPartialRouteObject = {
  path: '/network-events',
  children: [{ path: '/', element: <NetworkEvents /> }],
}

export const GatewayEvents = BaseRoute
