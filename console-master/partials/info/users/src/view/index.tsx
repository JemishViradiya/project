//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { lazy } from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'

import { AvertUserDetails } from './userDetails'

const UsersComponent = lazy(() => import('./users'))

const UsersRoute: UCPartialRouteObject = {
  path: '/users*',
  children: [{ path: '/', element: <UsersComponent /> }, AvertUserDetails],
}

export const AvertUsers: UCPartialRouteObject = {
  path: '/users/avert*',
  children: [{ path: '/', element: <UsersComponent /> }, AvertUserDetails],
}

export const DlpUsers = UsersRoute
