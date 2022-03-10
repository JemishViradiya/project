//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { lazy } from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'

import { EventList } from './events/dlp-events-list'

const EventsElement = lazy(() => import('./events'))
const FileInventoryElement = lazy(() => import('./file-inventory'))
const EvidenceLockerElement = lazy(() => import('./evidence-locker'))

const EventsRoute: UCPartialRouteObject = {
  path: '/events*',
  children: [
    { path: '/', element: <EventsElement /> },
    { path: '/:eventUUID', element: <EventsElement /> },
  ],
}

export const AvertEvents: UCPartialRouteObject = {
  path: '/events/avert*',
  children: [
    { path: '/', element: <EventsElement /> },
    { path: '/:eventUUID', element: <EventsElement /> },
  ],
}

export const DlpEvents = EventsRoute

export const FileInventoryRoute: UCPartialRouteObject = {
  path: '/file-inventory*',
  children: [{ path: '/', element: <FileInventoryElement /> }],
}

export const EvidenceLockerRoute: UCPartialRouteObject = {
  path: '/evidence-locker*',
  children: [{ path: '/', element: <EvidenceLockerElement /> }],
}

export { EventList }
