import React, { lazy } from 'react'

const PolicyCreate = lazy(() => import('./create'))

const PolicyUpdate = lazy(() => import('./update'))

const PolicyList = lazy(() => import('./list'))

const PolicyLoader = lazy(() => import('./loader'))

const Prefetch = lazy(() => import('./prefetch'))

export const ProtectMobilePolicies = {
  path: '/protectMobile',
  element: <PolicyList />,
}

export const ProtectMobilePolicy = {
  path: '/protectMobile',
  element: <Prefetch />,
  children: [
    { path: '/create', element: <PolicyLoader Component={<PolicyCreate />} /> },
    { path: '/update/:id', element: <PolicyLoader Component={<PolicyUpdate />} /> },
  ],
}
