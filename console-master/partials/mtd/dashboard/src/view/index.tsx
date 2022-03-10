import React from 'react'
import { Navigate } from 'react-router'

import { Permission } from '@ues-data/shared-types'
import type { TabRouteObject } from '@ues/behaviours'
import { SecuredContent, SecuredContentBoundary } from '@ues/behaviours'

const Dashboard = React.lazy(() => import('./dashboard'))
const VulnerableOSDetails = React.lazy(() => import('./widgets/vulnerability/v4/VulnerableOSDetails'))
const VulnerableOSCVEs = React.lazy(() => import('./widgets/vulnerability/v4/VulnerableOSCVEs'))
const VulnerabilitiesNavigation = React.lazy(() => import('./vulnerabilities-navigation'))

export const VulnerabilitiesRoutes: TabRouteObject[] = [
  {
    path: '/details',
    element: (
      <SecuredContentBoundary>
        <SecuredContent requiredPermissions={Permission.ECS_VULNERABILITIES_READ}>
          <VulnerableOSDetails />
        </SecuredContent>
      </SecuredContentBoundary>
    ),
    translations: {
      label: 'mtd/common:vulnerability.mobileOs',
    },
  },
]

export { useWidgetsLibrary as useMtdChartLibrary } from './chartLibrary'

export const ProtectMobileDashboard = {
  path: '/dashboard*',
  element: <Dashboard />,
}

export const ProtectMobileVulnerabilities = [
  {
    path: '/vulnerabilities/cve*',
    element: <VulnerableOSCVEs />,
  },
  {
    path: '/vulnerabilities*',
    element: <VulnerabilitiesNavigation />,
    children: [{ path: '/', element: <Navigate to={`.${VulnerabilitiesRoutes[0].path}`} /> }, ...VulnerabilitiesRoutes],
  },
]

export const ProtectMobile = [ProtectMobileDashboard, ...ProtectMobileVulnerabilities]
// configure partial
export const _routes = ProtectMobile
