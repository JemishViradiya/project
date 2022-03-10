import React, { lazy } from 'react'

const Authentication = lazy(() => import('./Authentication'))

export const AuthenticationPolicies = {
  path: '/authentication',
  element: <Authentication />,
}
