import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useRoutes } from 'react-router-dom'

import { BisDashboard } from '@ues-bis/dashboard'
import { AjaxDashboard } from '@ues-dashboard/ajax'
import { CronosDashboard } from '@ues-dashboard/cronos'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { GatewayDashboard } from '@ues-gateway/dashboard'
import { DlpDashboard } from '@ues-info/dashboard'
import { ProtectDashboard } from '@ues-protect/dashboard'
import { Loading, usePageTitle } from '@ues/behaviours'

import { useCronosDashboard } from './useCronosDashboard'

const AppRoutes = memo(() => {
  const features = useFeatures()
  const cronosNavigation = features.isEnabled(FeatureName.UESCronosNavigation)

  // preload translations for 'general/form' and 'components' to prevent re-rendering of dashboard pages
  const { t } = useTranslation(['dashboard', 'general/form', 'general/page', 'components', 'navigation'])

  usePageTitle(t('pageTitle'))
  useCronosDashboard(cronosNavigation)

  return useRoutes([
    { path: '/loading', element: <Loading /> },
    {
      path: '/static',
      children: [
        // static dashboards (for now)
        ProtectDashboard,
        BisDashboard,
        { ...DlpDashboard, path: '/info' },
        { ...GatewayDashboard, path: '/gateway' },
      ],
    },
    cronosNavigation ? CronosDashboard : AjaxDashboard,
    { path: '/', element: <Navigate to="/dashboard" /> },
  ])
})

export default <AppRoutes />
