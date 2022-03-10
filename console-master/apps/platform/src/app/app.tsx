/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import { GatewayAlerts } from '@ues-bis/gateway-alerts'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { Emm } from '@ues-emm/connection'
import { PlatformEndpoints } from '@ues-platform/entities'
import { PlatformGroups } from '@ues-platform/groups'
import { AuthenticationPolicies, PlatformUsers } from '@ues-platform/policies'
import { Reports } from '@ues-platform/reporting'
import { PlatformSettings } from '@ues-platform/settings'
import { PlatformUsersV2 } from '@ues-platform/users'
import { Loading } from '@ues/behaviours'

const loading = { path: '/loading', element: <Loading /> }
const fallback = { path: '/*', element: <Navigate to="/users" /> }

// Show UserTableAggregated only for cronos
const getPlatformUsers = isFeatureEnabled => {
  const cronosNavigation = isFeatureEnabled(FeatureName.UESCronosNavigation)
  return cronosNavigation
    ? { ...PlatformUsers, children: [PlatformUsersV2.children[0], ...PlatformUsers.children.slice(1)] }
    : PlatformUsers
}

const routes = [
  loading,
  GatewayAlerts,
  PlatformGroups,
  AuthenticationPolicies,
  PlatformSettings,
  PlatformEndpoints,
  Reports,
  fallback,
  Emm,
]

const AppRoutes = () => {
  const { isEnabled } = useFeatures()
  const usersRoutes = getPlatformUsers(isEnabled)
  return useRoutes([usersRoutes, ...routes])
}

export default <AppRoutes />
