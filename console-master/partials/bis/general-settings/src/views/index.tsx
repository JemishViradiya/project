import React from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'

const GeneralSettingsView = React.lazy(() => import('./general-settings'))

export const GeneralSettings: UCPartialRouteObject = {
  path: '/general-settings',
  children: [{ path: '/', element: <GeneralSettingsView /> }],
}
