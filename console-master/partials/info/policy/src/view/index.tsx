import React, { lazy } from 'react'
import { Navigate } from 'react-router-dom'

import { DlpContentPolicy, DlpMobilePolicy, DlpPolicies, DlpPolicy } from './dlp-policy'

const UserPoliciesNavigation = lazy(() => import('./policies-navigation'))

export const DlpPolicyRoutes = {
  path: '/policies',
  element: <UserPoliciesNavigation />,
  children: [{ path: '/', element: <Navigate to={`.${DlpPolicies[0].path}`} /> }, ...DlpPolicies],
}

export { DlpPolicy, DlpContentPolicy, DlpMobilePolicy }
