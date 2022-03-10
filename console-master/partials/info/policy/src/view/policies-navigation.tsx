import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@material-ui/core'

import { HelpLinks } from '@ues/assets'
import { ContentArea, ContentAreaPanel, PageTitlePanel, SecuredContentBoundary, Tabs, useRoutedTabsProps } from '@ues/behaviours'

import { DlpPolicies } from './dlp-policy'

const tabs = DlpPolicies
const Child: React.FC<{ value: string }> = ({ value, children }) => {
  const { componentHeader = null } = tabs.find(tab => tab.path === value) || {}
  return (
    <Box>
      {componentHeader && (
        <Box mb={6}>
          {typeof componentHeader === 'string' ? <Typography variant="body2">{componentHeader}</Typography> : componentHeader}
        </Box>
      )}
      {children}
    </Box>
  )
}

export const UserPoliciesNavigation = () => {
  const { t } = useTranslation('dlp/policy')
  const tabsProps = useRoutedTabsProps({ tabs })
  const { children, value } = tabsProps

  return (
    <Box width="100%" display="flex" flexDirection="column">
      <PageTitlePanel title={[t('policy.pageTitle'), t('navigation.title')]} helpId={HelpLinks.DlpContentPolicy} />
      <Tabs {...tabsProps}>
        <ContentArea>
          <ContentAreaPanel ContentWrapper={SecuredContentBoundary} fullWidth>
            <Child value={value}>{children}</Child>
          </ContentAreaPanel>
        </ContentArea>
      </Tabs>
    </Box>
  )
}
export default UserPoliciesNavigation
