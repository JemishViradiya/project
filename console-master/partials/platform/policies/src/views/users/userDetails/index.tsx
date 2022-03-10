import React, { lazy } from 'react'
import type { PartialRouteObject } from 'react-router'
import { Navigate } from 'react-router'

import { firstPath } from '../userUtils'
import { Routes } from './routes'

const UserDetailsElement = lazy(() => import('./UserDetails'))

export const UserDetails: PartialRouteObject = {
  path: '/:id',
  element: <UserDetailsElement />,
  children: [
    {
      path: '/',
      element: <Navigate to={`.${firstPath(Routes)}`} replace={true} />,
    },
    ...Routes,
  ],
}

export { useDeviceDeactivation } from './views/Devices/useDeviceDeactivation'
export { Configuration } from './views'
