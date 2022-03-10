import React from 'react'
import type { PartialRouteObject } from 'react-router'

const Settings = React.lazy(() => import('./GeneralSettings'))

export const GeneralSettings: PartialRouteObject = {
  path: '/settings/general',
  element: <Settings />,
}
