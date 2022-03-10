/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { lazy } from 'react'

const List = lazy(() => import('./list'))

const Create = lazy(() => import('./create'))

const Update = lazy(() => import('./update'))

const Prefetch = lazy(() => import('./prefetch'))

export const EnterpriseIdentityPolicies = {
  path: '/enterpriseIdentity',
  element: <List />,
}

export const EnterpriseIdentityPolicy = {
  path: '/enterpriseIdentity',
  element: <Prefetch />,
  children: [
    { path: '/create', element: <Create /> },
    { path: '/update/:id', element: <Update /> },
  ],
}
