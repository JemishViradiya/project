import React from 'react'

import { SecuredContentBoundary } from '@ues/behaviours'

import { EndpointSourceIpAddresses } from './views'

export * from './views'

export const _defaultRoute = '/list'

export const _routes = [
  {
    path: '/list',
    element: (
      <SecuredContentBoundary>
        <EndpointSourceIpAddresses isBlacklist />,
      </SecuredContentBoundary>
    ),
  },
]
