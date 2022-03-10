//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'

import { useBISPolicySchema } from '@ues-data/bis'
import { FeatureName, useFeatures } from '@ues-data/shared'
import {
  ContentArea,
  ContentAreaPanel,
  PageTitlePanel,
  SecuredContentBoundary,
  Tabs,
  usePageTitle,
  useRoutedTabsProps,
} from '@ues/behaviours'

import { Routes } from './user-policies-routes'

export const UserPoliciesNavigation = () => {
  const { t } = useTranslation(['profiles'])
  usePageTitle(t('navigation.title'))

  const features = useFeatures()
  const { isMigratedToDP, isMigratedToACL } = useBISPolicySchema()
  const cronosNavigation = features.isEnabled(FeatureName.UESCronosNavigation)

  const tabsProps = useRoutedTabsProps({ tabs: Routes, extraTenantFeatures: { isMigratedToDP, isMigratedToACL } })
  const currentRoute = Routes.find(route => route.path === tabsProps.value)
  const helpLink = currentRoute.helpLink
    ? currentRoute.helpLink
    : currentRoute.feaurizedHelpLink
    ? currentRoute.feaurizedHelpLink(features.isEnabled)
    : null

  return (
    <Box width="100%" display="flex" flexDirection="column">
      <PageTitlePanel
        title={[cronosNavigation ? t('navigation.policies') : t('navigation.gateway'), t('navigation.title')]}
        helpId={helpLink}
      />
      <Tabs navigation {...tabsProps}>
        <ContentArea>
          <ContentAreaPanel ContentWrapper={SecuredContentBoundary} fullWidth={true}>
            {tabsProps.children}
          </ContentAreaPanel>
        </ContentArea>
      </Tabs>
    </Box>
  )
}

export default UserPoliciesNavigation
