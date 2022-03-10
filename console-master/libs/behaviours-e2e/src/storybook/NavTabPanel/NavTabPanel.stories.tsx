import React, { memo } from 'react'
import { Navigate, useRoutes } from 'react-router'

import { Box, Typography } from '@material-ui/core'

import type { TabRouteObject } from '@ues/behaviours'
import { ContentArea, ContentAreaPanel, Tabs, useRoutedTabsProps } from '@ues/behaviours'

import { randomString } from '../utils'

interface TabPanelProps {
  title?: string
  children?: React.ReactNode
  fullWidth?: boolean
}

const TabPanelComponent = (props: TabPanelProps) => {
  const { title, children, fullWidth } = props

  return (
    <ContentAreaPanel title={title} fullWidth={fullWidth}>
      <Box>{children}</Box>
    </ContentAreaPanel>
  )
}

const tabs: TabRouteObject[] = [
  {
    path: '/first',
    translations: {
      label: 'Device list',
    },
    element: (
      <TabPanelComponent title="Device list">
        <Typography> {randomString()}</Typography>
      </TabPanelComponent>
    ),
  },
  {
    path: '/second',
    translations: {
      label: 'Device tags',
    },
    element: (
      <TabPanelComponent title="Device tags">
        <Typography> {randomString()}</Typography>
      </TabPanelComponent>
    ),
  },
  {
    path: '/third',
    translations: {
      label: 'Full width content',
    },
    element: (
      <TabPanelComponent title="Full width content" fullWidth>
        <Typography> {randomString()}</Typography>
      </TabPanelComponent>
    ),
  },
  {
    path: '/fourth',
    translations: {
      label: 'Device tab - disabled',
    },
    disabled: true,
  },
]

const TabPanelStoryComponent = args => {
  const tabsProps = useRoutedTabsProps({ tabs })

  return (
    <Tabs navigation {...tabsProps}>
      <ContentArea>{tabsProps.children}</ContentArea>
    </Tabs>
  )
}

const StoryRoutes = memo(() =>
  useRoutes([
    {
      path: '/',
      element: <TabPanelStoryComponent />,
      children: [{ path: '/', element: <Navigate to={`./first`} /> }, ...tabs],
    },
  ]),
)

const TabPanelStory = (story, ctx) => {
  return <StoryRoutes />
}

export const TabPanel = TabPanelStory.bind({})

export default {
  title: 'Layout/Page elements/Nav tabs (top level)',

  parameters: {
    controls: { hideNoControlsWarning: true },
  },
}
