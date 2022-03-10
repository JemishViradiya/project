import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { EndpointSourceIpAddresses } from '@ues-bis/ip-address'
import { FeatureName } from '@ues-data/shared-types'
import type { TabRouteObject } from '@ues/behaviours'
import { ContentAreaPanel, SecuredContentBoundary, Tabs, useRoutedTabsProps } from '@ues/behaviours'

import { TabsWrapper } from './common/TabsWrapper'
import RestrictedApps from './restricted-apps'
import RestrictedDevelopers from './restricted-dev-certs'
import RestrictedDomains from './restricted-domains'
import RestrictedIpAddresses from './restricted-ip-addresses'
import { PathNames } from './types'

const RestrictedVerticalTabs: TabRouteObject<{ title?: string; description?: string }>[] = [
  {
    path: PathNames.DEVELOPERS,
    element: <RestrictedDevelopers />,
    translations: {
      label: 'mtd/common:exclusion.restrictedDevelopers.itemName',
      title: 'mtd/common:exclusion.restrictedDevelopers.title',
      description: 'mtd/common:exclusion.restrictedDevelopers.description',
    },
  },
  {
    path: PathNames.APPS,
    element: <RestrictedApps />,
    translations: {
      label: 'mtd/common:exclusion.restrictedApps.itemName',
      title: 'mtd/common:exclusion.restrictedApps.title',
      description: 'mtd/common:exclusion.restrictedApps.description',
    },
  },
  {
    path: PathNames.IP_ADDRESSES,
    element: <RestrictedIpAddresses />,
    translations: {
      label: 'mtd/common:exclusion.restrictedIpAddresses.itemName',
      title: 'mtd/common:exclusion.restrictedIpAddresses.title',
      description: 'mtd/common:exclusion.restrictedIpAddresses.description',
    },
  },
  {
    path: PathNames.DOMAINS,
    element: <RestrictedDomains />,
    translations: {
      label: 'mtd/common:exclusion.restrictedDomains.itemName',
      title: 'mtd/common:exclusion.restrictedDomains.title',
      description: 'mtd/common:exclusion.restrictedDomains.description',
    },
  },
  {
    path: PathNames.ENDPOINT_SOURCE_IP_ADDRESSES,
    element: <EndpointSourceIpAddresses isBlacklist={true} />,
    features: isEnabled => isEnabled(FeatureName.BisIpFenceEnabled),
    translations: {
      label: 'mtd/common:exclusion.restrictedEndpointSourceIpAddress.itemName',
      title: 'mtd/common:exclusion.restrictedEndpointSourceIpAddress.title',
      description: 'mtd/common:exclusion.restrictedEndpointSourceIpAddress.description',
    },
  },
]

const TabContent: React.FC<{ value: string }> = memo(({ value, children }) => {
  const { t } = useTranslation(['mtd/common'])
  const tab = RestrictedVerticalTabs.find(tab => tab.path === value)
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!tab) return <>{children}</>

  return (
    <ContentAreaPanel title={t(tab.translations.title)} ContentWrapper={SecuredContentBoundary} fullHeight fullWidth>
      {tab.translations.description && <Typography>{t(tab.translations.description)}</Typography>}
      {children}
    </ContentAreaPanel>
  )
})

const RestrictedList: React.FC = () => {
  const { t } = useTranslation(['mtd/common'], { useSuspense: true })
  const tabsProps = useRoutedTabsProps({
    tabs: RestrictedVerticalTabs,
  })

  return (
    <TabsWrapper>
      <Tabs orientation="vertical" value={PathNames.DEVELOPERS} aria-label={t('restrictedList')} {...tabsProps} fullScreen>
        <TabContent value={tabsProps.value}>{tabsProps.children}</TabContent>
      </Tabs>
    </TabsWrapper>
  )
}

export default RestrictedList
