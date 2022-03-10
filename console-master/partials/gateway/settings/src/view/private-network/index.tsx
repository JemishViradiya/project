import React from 'react'

import type { ViewWrapperProps } from '@ues/behaviours'
import { SecuredContentBoundary, TabContentWrapper, Tabs, useRoutedTabsProps } from '@ues/behaviours'

const PrivateNetwork: React.FC<Pick<ViewWrapperProps, 'tabs' | 'fullWidthExceptions'>> = ({ tabs, fullWidthExceptions }) => {
  const tabsProps = useRoutedTabsProps({ tabs })
  const { value, children } = tabsProps
  const disableFullWidth = fullWidthExceptions?.includes(value)

  return (
    <Tabs orientation="vertical" {...tabsProps} fullScreen>
      <TabContentWrapper
        value={value}
        tabs={tabs}
        PanelProps={{ ContentWrapper: SecuredContentBoundary }}
        fullWidth={!disableFullWidth}
      >
        {children}
      </TabContentWrapper>
    </Tabs>
  )
}

export default PrivateNetwork
