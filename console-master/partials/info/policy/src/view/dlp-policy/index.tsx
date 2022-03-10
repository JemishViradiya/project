import React, { lazy } from 'react'
import { useTranslation } from 'react-i18next'

import { Link, Typography } from '@material-ui/core'

import { FeatureName } from '@ues-data/shared'
import { FeatureRoutesFilterHOC } from '@ues-info/shared'
import type { TabRouteObject } from '@ues/behaviours'

const List = lazy(() => import('./list'))

const Create = lazy(() => import('./create'))

const Update = lazy(() => import('./update'))

const MobileList = lazy(() => import('./mobile-policy/list'))

const routesToRemoveIfDisabled = [
  { path: 'mobile', featureName: FeatureName.UESDlpMobileNavigation },
  { path: 'content', featureName: FeatureName.UESDlpNavigation },
]

const PolicyHeader: React.FC = () => {
  const { t } = useTranslation('dlp/policy')
  return <Typography variant="body2">{t('navigation.adaptiveResponse.componentHeader.paragraph')}</Typography>
}

export const DlpPolicies: (TabRouteObject & { componentHeader?: React.ReactNode })[] = [
  {
    path: '/content',
    element: <List />,
    componentHeader: PolicyHeader,
    translations: {
      label: 'dlp/policy:policy.tabTitle.content',
    },
  },
  {
    path: '/mobile',
    features: isEnabled => isEnabled(FeatureName.UESDlpMobileNavigation),
    // features: [FeatureName.BGServiceEnablement, FeatureName.MobileEnrollment],
    element: (
      <FeatureRoutesFilterHOC routesToRemoveIfDisabled={[routesToRemoveIfDisabled[0]]}>
        <MobileList />
      </FeatureRoutesFilterHOC>
    ),
    translations: {
      label: 'dlp/policy:policy.tabTitle.mobile',
    },
  },
]

export const DlpPolicy = {
  path: '/:policyType',
  // element: <Prefetch />,
  children: [
    {
      path: '/create',
      element: (
        <FeatureRoutesFilterHOC routesToRemoveIfDisabled={routesToRemoveIfDisabled}>
          <Create />
        </FeatureRoutesFilterHOC>
      ),
    },
    {
      path: '/update/:guid',
      element: (
        <FeatureRoutesFilterHOC routesToRemoveIfDisabled={routesToRemoveIfDisabled}>
          <Update />
        </FeatureRoutesFilterHOC>
      ),
    },
  ],
}

export const DlpContentPolicy = {
  path: '/content',
  element: <List />,
}

export const DlpMobilePolicy = {
  path: '/mobile',
  element: (
    <FeatureRoutesFilterHOC routesToRemoveIfDisabled={[routesToRemoveIfDisabled[0]]}>
      <MobileList />
    </FeatureRoutesFilterHOC>
  ),
}
