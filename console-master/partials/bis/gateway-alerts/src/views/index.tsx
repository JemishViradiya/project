import React, { lazy } from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'
import { GatewayEvidence } from '@ues-bis/gateway-evidence'

const GatewayUserAlertsElement = lazy(() => import('./user-alerts'))

const GatewayAlertsElement = lazy(() => import('./alerts'))

const BaseRoute: UCPartialRouteObject = {
  path: '/alerts',
  children: [{ path: '/', element: <GatewayAlertsElement /> }, GatewayEvidence],
}

export const GatewayUserAlerts: UCPartialRouteObject = {
  path: '/gateway-alerts*',
  children: [{ path: '/', element: <GatewayUserAlertsElement /> }],
}

export { default as Alerts } from './alerts'

export const GatewayAlerts = BaseRoute
