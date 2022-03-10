import React, { lazy } from 'react'
import type { PartialRouteObject } from 'react-router'

const UserTableAggregated = lazy(() => import('./UserTableAggregated'))

export const PlatformUsersV2: PartialRouteObject = {
  path: '/users-v2',
  children: [{ path: '/', element: <UserTableAggregated /> }],
}

export const UserTableAggregatedRoute: PartialRouteObject = {
  path: '/',
  element: <UserTableAggregated />,
}
