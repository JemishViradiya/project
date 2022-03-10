import React from 'react'

import type { UCPartialRouteObject } from '@ues-behaviour/react'

import { MobileAlertByUser } from './MobileAlertByUser'

const MobileAlertsList = React.lazy(() => import('./MobileAlertsList'))

export const ProtectMobileAlerts = {
  path: '/mobile-alerts*',
  element: <MobileAlertsList />,
}

export const MtdUserAlerts: UCPartialRouteObject = {
  path: '/mtd-alerts',
  children: [{ path: '/', element: <MobileAlertByUser /> }],
}

export { MobileAlertByDevice } from './MobileAlertByDevice'
