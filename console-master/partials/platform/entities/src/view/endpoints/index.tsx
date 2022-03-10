import React, { lazy } from 'react'

import { FeatureName, useFeatures } from '@ues-data/shared'

const AlertsActions = lazy(() => import('./view/Alerts'))
const EndpointsTable = lazy(() => import('./EndpointsTable'))
const EndpointDetails = lazy(() => import('./EndpointDetails'))
const EventsActions = lazy(() => import('./view/Events'))
const ResponseActions = lazy(() => import('./view/ResponseActions'))

const FeatureWrapper = ({ children }) => {
  const { isEnabled } = useFeatures()
  const cronosNavigation = isEnabled(FeatureName.UESCronosNavigation)
  return cronosNavigation ? children : null
}

export const PlatformEndpoints = {
  path: '/mobile-devices',
  children: [
    {
      path: '/',
      element: (
        <FeatureWrapper>
          <EndpointsTable />
        </FeatureWrapper>
      ),
    },
    {
      path: '/:endpointId',
      element: (
        <FeatureWrapper>
          <EndpointDetails />
        </FeatureWrapper>
      ),
      children: [
        { path: '/alerts', element: <AlertsActions /> },
        { path: '/events', element: <EventsActions /> },
        { path: '/responseActions', element: <ResponseActions /> },
      ],
    },
  ],
}
