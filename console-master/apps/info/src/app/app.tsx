/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { memo } from 'react'
import { useRoutes } from 'react-router-dom'

import { FeatureName, useFeatures } from '@ues-data/shared'
import { DlpDashboard as DlpDashboardRoutes } from '@ues-info/dashboard'
import { DlpPolicy, DlpPolicyRoutes } from '@ues-info/policy'
import { DlpEvents, EvidenceLockerRoute, FileInventoryRoute } from '@ues-info/protect-info'
import { DlpSettingsRoutes } from '@ues-info/settings'
import { DlpUsers } from '@ues-info/users'
import { Loading } from '@ues/behaviours'

const loading = { path: '/loading', element: <Loading /> }

const ajaxRoutes = [loading]
const dlpRoutes = [
  loading,
  ...DlpSettingsRoutes,
  DlpPolicyRoutes,
  DlpDashboardRoutes,
  DlpPolicy,
  DlpEvents,
  DlpUsers,
  FileInventoryRoute,
  EvidenceLockerRoute,
]

export const AppRoutes = memo(() => {
  const features = useFeatures()
  const DlpNavigation = features.isEnabled(FeatureName.UESDlpNavigation)
  return useRoutes(DlpNavigation ? dlpRoutes : ajaxRoutes)
})

export default <AppRoutes />
