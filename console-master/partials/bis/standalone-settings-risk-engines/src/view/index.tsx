import React from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'

const Settings = React.lazy(() => import('./settingsRiskEngines/index'))

export const RiskEnginesSettings: UCPartialRouteObject = {
  path: '/settings/risk-engines',
  element: <Settings />,
}
