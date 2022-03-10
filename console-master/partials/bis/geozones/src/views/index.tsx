import React from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'

const Geozone = React.lazy(() => import('./geozone'))

export const Geozones: UCPartialRouteObject = {
  path: '/geozones',
  children: [{ path: '/', element: <Geozone /> }],
}
