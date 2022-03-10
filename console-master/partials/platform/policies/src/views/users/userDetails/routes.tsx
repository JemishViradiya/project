import React, { lazy } from 'react'

import { HelpLinks } from '@ues/assets'
import type { TabRouteObject } from '@ues/behaviours'

const AlertsTab = lazy(() => import('./Alerts'))
const EventsTab = lazy(() => import('./Events'))

const ConfigurationElement = lazy(() => import('./views/UserConfiguration'))
const DevicesElement = lazy(() => import('./views/Devices'))

export const Routes: (TabRouteObject & { helpLink?: string })[] = [
  {
    path: '/alerts*',
    element: <AlertsTab />,
    translations: {
      label: 'platform/common:users.details.panels.alerts',
    },
    helpLink: HelpLinks.Alerts,
  },
  {
    path: '/events*',
    element: <EventsTab />,
    translations: {
      label: 'platform/common:users.details.panels.events',
    },
  },
  {
    path: '/devices',
    element: <DevicesElement />,
    translations: {
      label: 'platform/common:users.details.panels.devices',
    },
  },
  {
    path: '/configuration',
    element: <ConfigurationElement />,
    translations: {
      label: 'platform/common:users.details.panels.configuration',
    },
  },
]
