import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { EndpointSourceIpAddresses } from '@ues-bis/ip-address'
import { FeatureName } from '@ues-data/shared-types'
import type { TabRouteObject } from '@ues/behaviours'
import { ContentAreaPanel, SecuredContentBoundary, Tabs, useRoutedTabsProps } from '@ues/behaviours'

import ApprovedApps from './approved-apps'
import ApprovedDevelopers from './approved-dev-certs'
import ApprovedDomains from './approved-domains'
import ApprovedIpAddresses from './approved-ip-addresses'
import { TabsWrapper } from './common/TabsWrapper'
import { PathNames } from './types'

const SafeVerticalTabs: TabRouteObject<{ title: string; description?: string }>[] = [
  {
    path: PathNames.DEVELOPERS,
    element: <ApprovedDevelopers />,
    translations: {
      label: 'mtd/common:exclusion.approvedDevelopers.itemName',
      title: 'mtd/common:exclusion.approvedDevelopers.title',
      description: 'mtd/common:exclusion.approvedDevelopers.description',
    },
  },
  {
    path: PathNames.APPS,
    element: <ApprovedApps />,
    translations: {
      label: 'mtd/common:exclusion.approvedApps.itemName',
      title: 'mtd/common:exclusion.approvedApps.title',
      description: 'mtd/common:exclusion.approvedApps.description',
    },
  },
  {
    path: PathNames.IP_ADDRESSES,
    element: <ApprovedIpAddresses />,
    translations: {
      label: 'mtd/common:exclusion.approvedIpAddresses.itemName',
      title: 'mtd/common:exclusion.approvedIpAddresses.title',
      description: 'mtd/common:exclusion.approvedIpAddresses.description',
    },
  },
  {
    path: PathNames.DOMAINS,
    element: <ApprovedDomains />,
    translations: {
      label: 'mtd/common:exclusion.approvedDomains.itemName',
      title: 'mtd/common:exclusion.approvedDomains.title',
      description: 'mtd/common:exclusion.approvedDomains.description',
    },
  },
  {
    path: PathNames.ENDPOINT_SOURCE_IP_ADDRESSES,
    element: <EndpointSourceIpAddresses isBlacklist={false} />,
    features: isEnabled => isEnabled(FeatureName.BisIpFenceEnabled),
    translations: {
      label: 'mtd/common:exclusion.approvedEndpointSourceIpAddress.itemName',
      title: 'mtd/common:exclusion.approvedEndpointSourceIpAddress.title',
      description: 'mtd/common:exclusion.approvedEndpointSourceIpAddress.description',
    },
  },
]

const TabContent: React.FC<{ value: string }> = memo(({ value, children }) => {
  const { t } = useTranslation(['mtd/common'])
  const tab = SafeVerticalTabs.find(tab => tab.path === value)
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!tab) return <>{children}</>

  return (
    <ContentAreaPanel title={t(tab.translations.title)} ContentWrapper={SecuredContentBoundary} fullHeight fullWidth>
      {tab.translations.description && <Typography>{t(tab.translations.description)}</Typography>}
      {children}
    </ContentAreaPanel>
  )
})

const SafeList: React.FC = () => {
  const { t } = useTranslation(['mtd/common'], { useSuspense: true })
  const tabsProps = useRoutedTabsProps({
    tabs: SafeVerticalTabs,
  })

  return (
    <TabsWrapper>
      <Tabs orientation="vertical" value={PathNames.DEVELOPERS} aria-label={t('safeList')} {...tabsProps} fullScreen>
        <TabContent value={tabsProps.value}>{tabsProps.children}</TabContent>
      </Tabs>
    </TabsWrapper>
  )
}

export default SafeList
