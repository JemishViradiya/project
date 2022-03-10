import React from 'react'
import { useTranslation } from 'react-i18next'

import { Layout } from '@ues-info/shared'
import { HelpLinks } from '@ues/assets'
import {
  ContentArea,
  ContentAreaPanel,
  PageTitlePanel,
  SecuredContentBoundary,
  Tabs,
  usePageTitle,
  useRoutedTabsProps,
} from '@ues/behaviours'

import { tenantSettingsMap } from './settings/const/tenantSettings'
import DataCollectionSettings from './settings/general/DataCollectionSettings'

const DlpSetting = () => {
  const { t } = useTranslation('dlp/common')
  const tabsProps = useRoutedTabsProps({ tabs: tenantSettingsMap })
  const notWidePages = ['/whitelisting', '/data-collection']

  usePageTitle(t('setting.mainSection.pageTitle'))

  const currentRoute = tenantSettingsMap.find(route => route.path === tabsProps.value)

  return (
    <Layout>
      <PageTitlePanel title={[t('setting.mainSection.pageTitle'), t('labelDlp')]} helpId={currentRoute?.helpId} />
      <Tabs navigation {...tabsProps}>
        <ContentArea>
          <ContentAreaPanel
            ContentWrapper={SecuredContentBoundary}
            fullWidth={notWidePages.some(tab => tabsProps.value.includes(tab)) ? false : true}
          >
            {tabsProps.children}
          </ContentAreaPanel>
        </ContentArea>
        {tabsProps.value === notWidePages[0] && (
          <ContentArea>
            <ContentAreaPanel ContentWrapper={SecuredContentBoundary}>{<DataCollectionSettings />}</ContentAreaPanel>
          </ContentArea>
        )}
      </Tabs>
    </Layout>
  )
}

export default DlpSetting
