import React, { lazy } from 'react'

import type { TabRouteObject } from '@ues/behaviours'

const ResponseActionsElement = lazy(() => import('./view/ResponseActions'))
const AlertsElement = lazy(() => import('./view/Alerts'))
const EventsElement = lazy(() => import('./view/Events'))

export const Routes: (TabRouteObject & { helpLink?: string })[] = [
  {
    path: '/alerts',
    element: <AlertsElement />,
    translations: {
      label: 'platform/endpoints:endpoint.details.panels.alerts',
    },
  },
  {
    path: '/events',
    element: <EventsElement />,
    translations: {
      label: 'platform/endpoints:endpoint.details.panels.events',
    },
  },
  {
    path: '/responseActions',
    element: <ResponseActionsElement />,
    translations: {
      label: 'platform/endpoints:endpoint.details.panels.responseActions',
    },
  },
]
