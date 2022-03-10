import React, { lazy } from 'react'
import type { PartialRouteObject } from 'react-router'

const UserList = lazy(() => import('./usersList/userList'))
const UserDetails = lazy(() => import('./userDetails/userDetails'))

export const PersonaUsers: PartialRouteObject = {
  path: '/users',
  children: [
    { path: '/', element: <UserList /> },
    { path: '/:userId', element: <UserDetails /> },
  ],
}
