import React from 'react'
import { Navigate } from 'react-router'

import type { TabRouteObject } from '@ues/behaviours'

import { DataType, tenantSettingsMap } from './settings/const/tenantSettings'

const Settings = React.lazy(() => import('./DlpSettings'))

export const DlpSettingsRoutes = [
  {
    path: '/settings',
    element: <Settings />,
    children: [{ path: '/', element: <Navigate to={`./${tenantSettingsMap[0].path}`} /> }, ...tenantSettingsMap],
  },
  DataType,
]

export const AvertSettingsRoutes = [
  {
    path: '/settings/avert',
    element: <Settings />,
    children: [{ path: '/', element: <Navigate to={`./${tenantSettingsMap[0].path}`} /> }, ...tenantSettingsMap],
  },
  DataType,
]
