import React, { lazy } from 'react'
import type { PartialRouteObject } from 'react-router'
import { Navigate } from 'react-router'

import { Routes } from './routes'

const UserDetailsElement = lazy(() => import('./UserDetails'))

export const AvertUserDetails: PartialRouteObject = {
  path: '/:id',
  element: <UserDetailsElement />,
  children: [
    {
      path: '/',
      element: <Navigate to={`././${Routes[0].path}`} replace={true} />,
    },
    ...Routes,
  ],
}
