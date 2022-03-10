import React, { lazy } from 'react'

import type { TabRouteObject } from '@ues/behaviours'

const ConfigurationElement = lazy(() => {
  return import('@ues-platform/policies').then(mod => {
    return Promise.resolve({ default: mod.Configuration })
  })
})

const DevicesElement = lazy(() => import('./Devices'))

// TODO: add events and devices tabs in scope of further features
const EventsByUser = lazy(() => import('./Events'))
// const DevicesElement = lazy(() => import('./views/Devices'))

export const Routes: TabRouteObject[] = [
  {
    path: '/events',
    element: <EventsByUser />,
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
