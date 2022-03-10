//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { lazy } from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'

const UserNetworkEventsView = lazy(() => import('./network-events/views/user-network-events'))
const DeviceDetailsElement = lazy(() => import('./network-events/views/device-details'))

export const DeviceDetailsNetworkEvents = DeviceDetailsElement

export const UserNetworkEvents: UCPartialRouteObject = {
  path: '/network-events',
  children: [{ path: '/', element: <UserNetworkEventsView /> }],
}
