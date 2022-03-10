import React, { lazy } from 'react'
import { Navigate } from 'react-router'

import { EndpointSourceIpAddresses } from '@ues-bis/ip-address'
import { Permission } from '@ues-data/shared-types'
import { HelpLinks } from '@ues/assets'
import type { TabRouteObject } from '@ues/behaviours'
import { SecuredContent, ViewWrapper } from '@ues/behaviours'

import { PathNames } from './types'

const ApprovedDevelopers = lazy(() => import('./approved-dev-certs'))
const ApprovedApps = lazy(() => import('./approved-apps'))
const RestrictedDevelopers = lazy(() => import('./restricted-dev-certs'))
const RestrictedApps = lazy(() => import('./restricted-apps'))

const ApprovedIpAddresses = lazy(() => import('./approved-ip-addresses'))
const RestrictedIpAddresses = lazy(() => import('./restricted-ip-addresses'))
const ApprovedDomains = lazy(() => import('./approved-domains'))
const RestrictedDomains = lazy(() => import('./restricted-domains'))

const SafeList = lazy(() => import('./SafeList'))
const RestrictedList = lazy(() => import('./RestrictedList'))

const errorPermissionHandlerWrap = el => (
  <SecuredContent requiredPermissions={Permission.VENUE_SETTINGSGLOBALLIST_READ}>{el}</SecuredContent>
)

export const GlobalListTabs: (TabRouteObject & { helpLink?: HelpLinks })[] = [
  {
    path: '/restricted',
    element: <RestrictedList />,
    children: [
      { path: '/', element: <Navigate to={`.${PathNames.DEVELOPERS}`} /> },
      { path: PathNames.DEVELOPERS, element: errorPermissionHandlerWrap(<RestrictedDevelopers />) },
      { path: PathNames.APPS, element: errorPermissionHandlerWrap(<RestrictedApps />) },
      { path: PathNames.IP_ADDRESSES, element: errorPermissionHandlerWrap(<RestrictedIpAddresses />) },
      { path: PathNames.DOMAINS, element: errorPermissionHandlerWrap(<RestrictedDomains />) },
      {
        path: PathNames.ENDPOINT_SOURCE_IP_ADDRESSES,
        element: errorPermissionHandlerWrap(<EndpointSourceIpAddresses isBlacklist={true} />),
      },
    ],
    translations: {
      label: 'mtd/common:tabs.restricted.label',
    },
    helpId: HelpLinks.ProtectMobileSafeUnsafeList,
  },
  {
    path: '/safe',
    element: <SafeList />,
    children: [
      { path: '/', element: <Navigate to={`.${PathNames.DEVELOPERS}`} /> },
      { path: PathNames.DEVELOPERS, element: errorPermissionHandlerWrap(<ApprovedDevelopers />) },
      { path: PathNames.APPS, element: errorPermissionHandlerWrap(<ApprovedApps />) },
      { path: PathNames.IP_ADDRESSES, element: errorPermissionHandlerWrap(<ApprovedIpAddresses />) },
      { path: PathNames.DOMAINS, element: errorPermissionHandlerWrap(<ApprovedDomains />) },
      {
        path: PathNames.ENDPOINT_SOURCE_IP_ADDRESSES,
        element: errorPermissionHandlerWrap(<EndpointSourceIpAddresses isBlacklist={false} />),
      },
    ],
    translations: {
      label: 'mtd/common:tabs.safe.label',
    },
    helpId: HelpLinks.ProtectMobileSafeUnsafeList,
  },
]

export const GlobalListRoutes = {
  path: '/settings/global-list',
  element: (
    <ViewWrapper
      basename="/settings/global-list"
      titleKey="console:protectGlobalListNew.title"
      tabs={GlobalListTabs}
      tKeys={['console', 'mtd/common']}
    />
  ),
  children: [{ path: '/', element: <Navigate to="./restricted" /> }, ...GlobalListTabs],
}
