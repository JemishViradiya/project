//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { useBISPolicySchema } from '@ues-data/bis'
import type { RoutedTabProps } from '@ues/behaviours'
import { PageTitlePanel, Tabs, useGetCurrentHelpLink, useRoutedTabsProps } from '@ues/behaviours'

const GatewaySettingsNavigation: React.FC<{
  childRoutes: RoutedTabProps['tabs']
}> = ({ childRoutes }) => {
  const { t } = useTranslation(['gateway-settings'])
  const currentHelpId = useGetCurrentHelpLink(childRoutes) ?? ''
  const { isMigratedToDP } = useBISPolicySchema()

  return (
    <>
      <PageTitlePanel borderBottom title={[t('labelGateway'), t('labelSettings')]} helpId={currentHelpId} />
      <Tabs navigation {...useRoutedTabsProps({ tabs: childRoutes, extraTenantFeatures: { isMigratedToDP } })} />
    </>
  )
}

export default GatewaySettingsNavigation
