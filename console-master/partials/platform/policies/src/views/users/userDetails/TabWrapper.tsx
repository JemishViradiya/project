import type { FC } from 'react'
import React from 'react'

import { Card, makeStyles } from '@material-ui/core'

import type { Permission } from '@ues-data/shared'
import { ContentArea, SecuredContentBoundary, Tabs, useRoutedTabsProps, useSecuredContent } from '@ues/behaviours'

const useStyles = makeStyles(theme => ({
  box: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(2)}px 0`,
  },
}))

export const SecuredTabWrapper: FC<{ permissionName: Permission }> = ({ permissionName, children }) => {
  useSecuredContent(permissionName)
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

export const UserDetailsTabWrapper = ({ tabs, label }) => {
  const { box } = useStyles()

  const tabsProps = useRoutedTabsProps({ tabs, navigateProps: { replace: true } })
  const currentTab = tabs.find(route => route.path === tabsProps.value)
  const permission = currentTab ? currentTab['permission'] : undefined
  return (
    <Card className={box} variant="outlined">
      <Tabs fullScreen {...tabsProps} aria-label={label}>
        <SecuredContentBoundary key={tabsProps.value}>
          <ContentArea height="100%">
            {permission ? (
              <SecuredTabWrapper permissionName={permission}>{tabsProps.children}</SecuredTabWrapper>
            ) : (
              tabsProps.children
            )}
          </ContentArea>
        </SecuredContentBoundary>
      </Tabs>
    </Card>
  )
}
