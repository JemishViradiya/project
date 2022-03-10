/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { memo } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import { AdaptiveResponsePolicy } from '@ues-bis/adaptive-response-policies'
import { AdaptiveSecurityRoutes } from '@ues-bis/adaptive-response-settings'
import { BisDashboard } from '@ues-bis/dashboard'
import { GatewayAlerts } from '@ues-bis/gateway-alerts'
import { RiskDetectionPolicy } from '@ues-bis/risk-detection-policies'
import { CronosDashboard } from '@ues-dashboard/cronos'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { EnterpriseIdentityPolicy } from '@ues-eid/policy'
import { Authentication, AuthenticationSettingsRoutes, AuthenticatorsRoutes } from '@ues-eid/settings'
import { EmmRoutes } from '@ues-emm/connection'
import { GatewayDashboard } from '@ues-gateway/dashboard'
import { EventsGateway } from '@ues-gateway/events'
import { GatewayPolicyDetails } from '@ues-gateway/policies'
import { GatewayNetworkSettings } from '@ues-gateway/settings'
import { DlpDashboard } from '@ues-info/dashboard'
import { DlpPolicy } from '@ues-info/policy'
import { AvertEvents } from '@ues-info/protect-info'
import { AvertSettingsRoutes } from '@ues-info/settings'
import { AvertUsers } from '@ues-info/users'
import { ProtectMobileAlerts } from '@ues-mtd/alerts'
import { ProtectMobileDashboard, ProtectMobileVulnerabilities } from '@ues-mtd/dashboard'
import { GlobalListRoutes, GlobalListTabs } from '@ues-mtd/exclusions'
import { ProtectMobilePolicy } from '@ues-mtd/policy'
import { PlatformEndpoints } from '@ues-platform/entities'
import { PlatformGroups } from '@ues-platform/groups'
import {
  ActivationProfile,
  ActivationProfiles,
  AuthenticationPolicies,
  PlatformUserRoutes,
  PlatformUsers,
} from '@ues-platform/policies'
import {
  ConnectionSettings,
  DirectoryConnectionsRoutes,
  DirectoryConnectionsTabs,
  PlatformBCNAdditional,
  PlatformCompanyDirectoryDetailsRoutes,
  PlatformSettings,
} from '@ues-platform/settings'
import { UserTableAggregatedRoute } from '@ues-platform/users'
import { ProtectDashboard } from '@ues-protect/dashboard'
import { DevicePoliciesRoutes } from '@ues-protect/device-policies'
import { Loading, ViewWrapper } from '@ues/behaviours'

import { useCronosDashboard } from './useCronosDashboard'
import { UserPoliciesNavigation } from './user-policies-navigation' //TODO: REFACTOR TO PARTIAL
import { Routes } from './user-policies-routes'

const loading = { path: '/loading', element: <Loading /> }
const fallback = { path: '/*', element: <Navigate to="/dashboard" /> }

const cronosFallback = { path: '/*', element: <Navigate to="/settings/authentication/authenticators" /> }
const consoleCronosTKey = 'console'

const cronosRoutes = [
  loading,
  EmmRoutes,
  {
    path: '/settings/authentication/authenticators',
    element: (
      <ViewWrapper
        basename="/settings/authentication/authenticators"
        titleKey="console:authentication.title"
        tKeys={[consoleCronosTKey]}
      >
        <Authentication />
      </ViewWrapper>
    ),
  },
  ...AuthenticationSettingsRoutes,
  AdaptiveSecurityRoutes,
  {
    path: '/settings/global-list',
    element: (
      <ViewWrapper
        basename="/settings/global-list"
        titleKey="console:protectGlobalListNew.title"
        tabs={GlobalListTabs}
        tKeys={[consoleCronosTKey, 'mtd/common']}
      />
    ),
    children: [{ path: '/', element: <Navigate to="./restricted" /> }, ...GlobalListTabs],
  },
  {
    path: '/settings/directory-connections',
    element: <ConnectionSettings />,
    children: [{ path: '/', element: <Navigate to="./company-directory" /> }, ...DirectoryConnectionsTabs],
  },
  PlatformCompanyDirectoryDetailsRoutes,
  PlatformBCNAdditional,
  ...GatewayNetworkSettings,
  cronosFallback,
]

const wrappedCronosRoutes = [
  {
    path: '/*',
    element: <MainWrapper />,
    children: cronosRoutes,
  },
]

const singleNxAppRoutesWrapped = [
  loading,
  ...AuthenticatorsRoutes,
  AdaptiveSecurityRoutes,
  GlobalListRoutes,
  DirectoryConnectionsRoutes,
  PlatformCompanyDirectoryDetailsRoutes,
  PlatformBCNAdditional,
  ...GatewayNetworkSettings,
  ProtectMobileAlerts,
  { ...PlatformUsers, children: [UserTableAggregatedRoute, ...PlatformUserRoutes] },
  GatewayAlerts,
  PlatformGroups,
  AuthenticationPolicies,
  PlatformSettings,
  EmmRoutes,
  EventsGateway,
  ActivationProfile,
  ProtectMobilePolicy,
  EnterpriseIdentityPolicy,
  ...GatewayPolicyDetails,
  AdaptiveResponsePolicy,
  RiskDetectionPolicy,
  ...AvertSettingsRoutes,
  DlpPolicy,
  AvertEvents,
  AvertUsers,
  {
    //TODO: REFACTOR TO PARTIAL
    path: '/list',
    element: <UserPoliciesNavigation />,
    children: [{ path: '/', element: <Navigate to={`.${ActivationProfiles.path}`} /> }, ...Routes],
  },
  fallback,
]

const singleNxAppRoutes = [
  {
    path: '/*',
    element: <MainWrapper />,
    children: singleNxAppRoutesWrapped,
  },
  {
    path: '/static',
    children: [
      // static dashboards (for now)
      ProtectDashboard,
      BisDashboard,
      { ...ProtectMobileDashboard, path: '/mtd' },
      { ...DlpDashboard, path: '/info' },
      { ...GatewayDashboard, path: '/gateway' },
    ],
  },
  CronosDashboard, // future standard for dashboards
  ...ProtectMobileVulnerabilities,
  PlatformEndpoints,
  ...DevicePoliciesRoutes,
]

const wrappedDevicePoliciesRoutes = [
  {
    path: '/*',
    element: <MainWrapper />,
    children: DevicePoliciesRoutes,
  },
]

function MainWrapper() {
  return (
    <main style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
      <Outlet />
    </main>
  )
}

export const AppRoutes = memo(() => {
  const { isEnabled } = useFeatures()

  const navRoutes = isEnabled(FeatureName.SingleNXApp) ? singleNxAppRoutes : wrappedCronosRoutes
  const devicePoliciesRoutes = isEnabled(FeatureName.UESDevicePolicies) ? wrappedDevicePoliciesRoutes : []

  const routes = useRoutes([...navRoutes, ...devicePoliciesRoutes])
  useCronosDashboard(true)
  return routes
})

export default <AppRoutes />
