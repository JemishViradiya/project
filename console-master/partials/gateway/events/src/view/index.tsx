//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { lazy } from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'
import { Types } from '@ues-gateway/shared'

const Events = lazy(() => import('./events'))
const UsersEvents = lazy(() => import('./events/users'))
const DestinationEvents = lazy(() => import('./events/destination'))

const EndpointEvents = lazy(() => import('./endpoint-events'))
const UserEvents = lazy(() => import('./user-events'))

const EventsChildrenRoutes: UCPartialRouteObject[] = [
  { path: '/', element: <Events /> },
  { path: `/${Types.EventsGroupByParam.Users}`, element: <UsersEvents /> },
  { path: `/${Types.EventsGroupByParam.Destination}`, element: <DestinationEvents /> },
]

const BaseRoute: UCPartialRouteObject = {
  path: '/events*',
  children: EventsChildrenRoutes,
}

export const GatewayUserEvents: UCPartialRouteObject = {
  path: '/gateway-events*',
  children: [{ path: '/', element: <UserEvents /> }],
}

export const GatewayEvents = BaseRoute

export const EventsGateway: UCPartialRouteObject = {
  path: '/events/gateway*',
  children: EventsChildrenRoutes,
}

export const GatewayEndpointEvents = EndpointEvents

export const NetworkTrafficList = lazy(() => import('./components/network-traffic-list'))
export * from './components/types'
