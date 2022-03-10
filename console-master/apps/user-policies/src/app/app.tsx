import React, { memo } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import { Loading } from '@ues/behaviours'

import { ProfilesRoutes } from '../views/user-policies'

const loading = { path: '/loading', element: <Loading /> }
// The fallback must be the same as the first tab item in:
// - apps/user-policies/src/views/user-policies/user-policies-navigation.tsx
// which must not be featurized off
const fallback = { path: '/*', element: <Navigate to="/list/activation" /> }

const AppRoutes = memo(() => (
  <main style={{ padding: 0, display: 'flex', flexDirection: 'row' }}>{useRoutes([loading, ...ProfilesRoutes, fallback])}</main>
))

export default <AppRoutes />
