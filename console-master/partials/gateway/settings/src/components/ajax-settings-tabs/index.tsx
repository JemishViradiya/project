//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { useBISPolicySchema } from '@ues-data/bis'
import type { ViewWrapperProps } from '@ues/behaviours'
import { ContentArea, ContentAreaPanel, SecuredContentBoundary, Tabs, useRoutedTabsProps } from '@ues/behaviours'

const TabContent: React.FC<{ tabs: ViewWrapperProps['tabs']; value: string; showFullHeight?: boolean }> = ({
  tabs,
  value,
  showFullHeight,
  children,
}) => {
  const { t } = useTranslation(['gateway/common'])
  const tab = tabs.find(tab => tab.path === value)

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!tab) return <>{children}</>

  const title = t(tab.translations.label)
  const description = tab.translations.description && <Typography>{t(tab.translations.description)}</Typography>

  const contentAreaPanelProps = {
    title,
    ContentWrapper: SecuredContentBoundary,
    ...(showFullHeight && { fullHeight: true }),
  }

  return (
    <ContentAreaPanel {...contentAreaPanelProps}>
      {description}
      {children}
    </ContentAreaPanel>
  )
}

export const AjaxSettingsTabs: React.FC<Pick<ViewWrapperProps, 'tabs'>> = ({ tabs }) => {
  const { t } = useTranslation(['gateway/common'], { useSuspense: true })
  const { isMigratedToACL } = useBISPolicySchema()
  const tabsProps = useRoutedTabsProps({
    tabs,
    extraTenantFeatures: { isMigratedToACL },
  })
  const { value, children } = tabsProps

  return (
    <ContentArea height="100%" alignItems="left">
      <Tabs orientation="vertical" aria-label={t('labelSelectGatewaySettings')} {...tabsProps} fullScreen>
        <TabContent value={value} tabs={tabs}>
          {children}
        </TabContent>
      </Tabs>
    </ContentArea>
  )
}
