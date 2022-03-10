//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'

import { HelpLinks } from '@ues/assets'
import { PageTitlePanel, Tabs, usePageTitle, useRoutedTabsProps } from '@ues/behaviours'

import { VulnerabilitiesRoutes } from './index'

const VulnerabilitiesNavigation = () => {
  const { t } = useTranslation(['mtd/common'])
  usePageTitle(t('vulnerability.osdetails.title2'))
  const tabsProps = useRoutedTabsProps({ tabs: VulnerabilitiesRoutes })

  return (
    <Box width="100%" display="flex" flexDirection="column">
      <PageTitlePanel
        title={[t('vulnerability.osdetails.title1'), t('vulnerability.osdetails.title2')]}
        helpId={HelpLinks.Vulnerabilities}
      />
      <Tabs navigation fullScreen={true} {...tabsProps}>
        {tabsProps.children}
      </Tabs>
    </Box>
  )
}

export default VulnerabilitiesNavigation
