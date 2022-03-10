//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { lazy } from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'

const List = lazy(() => import('./list'))
const CreatePolicy = lazy(() => import('./create'))
const EditPolicy = lazy(() => import('./edit'))

export const AdaptiveResponsePolicies: UCPartialRouteObject = {
  path: '/adaptiveResponse',
  children: [{ path: '/', element: <List /> }],
}

export const AdaptiveResponsePolicy: UCPartialRouteObject = {
  path: '/adaptiveResponse',
  children: [
    { path: '/create', element: <CreatePolicy /> },
    { path: '/:entityId/*', element: <EditPolicy /> },
  ],
}
