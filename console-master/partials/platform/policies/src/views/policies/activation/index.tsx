import React, { lazy } from 'react'

const ActivationList = lazy(() => import('./ActivationProfilesList'))

const ActivationProfileAdd = lazy(() => import('./add/ActivationProfileAdd'))

const ActivationProfileEdit = lazy(() => import('./edit/ActivationProfileEdit'))

const ActivationProfileCopy = lazy(() => import('./add/ActivationProfileCopy'))

export const ActivationProfiles = {
  path: '/activation',
  element: <ActivationList />,
}

export const ActivationProfile = {
  path: '/activation',
  children: [
    { path: '/add', element: <ActivationProfileAdd /> },
    { path: '/edit/:profileId', element: <ActivationProfileEdit /> },
    { path: '/copy/:profileId', element: <ActivationProfileCopy /> },
  ],
}
