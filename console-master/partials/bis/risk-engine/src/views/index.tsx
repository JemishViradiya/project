import React from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'

const RiskEngineView = React.lazy(() => import('./riskEngine'))

export const RiskEngine: UCPartialRouteObject = {
  path: '/risk-engine',
  children: [{ path: '/', element: <RiskEngineView /> }],
}
