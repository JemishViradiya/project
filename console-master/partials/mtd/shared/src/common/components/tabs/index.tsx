//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React, { useEffect, useState } from 'react'

import type { TabsProps as MuiTabsProps } from '@material-ui/core'
import { AppBar, Tab, Tabs as MuiTabs } from '@material-ui/core'

export interface TabsProps extends Omit<MuiTabsProps, 'onChange'> {
  items: Array<{
    label: string
    component: React.ReactNode
  }>
  defaultSelectedTabIndex?: number
  onChange?: (selectedTabIndex: number) => void
}

export const Tabs: React.FC<TabsProps> = ({ items = [], defaultSelectedTabIndex = 0, onChange, ...muiTabsProps }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(defaultSelectedTabIndex)

  useEffect(() => {
    if (onChange) {
      onChange(selectedTabIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTabIndex])

  const { labels, components } = items.reduce(
    (acc, item, index) => ({
      labels: [...acc.labels, <Tab key={index} label={item.label} />],
      components: [
        ...acc.components,
        <div key={index} role="tabpanel" hidden={selectedTabIndex !== index}>
          {selectedTabIndex === index && item.component}
        </div>,
      ],
    }),
    { labels: [], components: [] },
  )

  return (
    <>
      <AppBar position="static">
        <MuiTabs {...muiTabsProps} value={selectedTabIndex} onChange={(_, newValue) => setSelectedTabIndex(newValue)}>
          {labels}
        </MuiTabs>
      </AppBar>

      {components}
    </>
  )
}
