//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { lazy } from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'

import { ROUTE_PATH } from '../config/route'

const List = lazy(() => import('./list'))
const CreatePolicy = lazy(() => import('./create'))
const EditPolicy = lazy(() => import('./edit'))

export const RiskDetectionPolicies: UCPartialRouteObject = {
  path: ROUTE_PATH,
  children: [{ path: '/', element: <List /> }],
}

export const RiskDetectionPolicy: UCPartialRouteObject = {
  path: ROUTE_PATH,
  children: [
    { path: '/create', element: <CreatePolicy /> },
    { path: '/:entityId/*', element: <EditPolicy /> },
  ],
}
