import React, { lazy } from 'react'
import type { PartialRouteObject } from 'react-router'

import { UserDetails } from './userDetails'

const UserTable = lazy(() => import('./UserTable'))
const AddUsers = lazy(() => import('./addUsers/AddUsers'))

export const PlatformUsers: PartialRouteObject = {
  path: '/users',
  children: [
    {
      path: '/',
      element: <UserTable />,
    },
    {
      path: '/add',
      element: <AddUsers />,
    },
    UserDetails,
  ],
}

export { useDeviceDeactivation } from './userDetails'

export const PlatformUserRoutes = [
  {
    path: '/add',
    element: <AddUsers />,
  },
  UserDetails,
]

export { Configuration } from './userDetails/views/Configuration'
