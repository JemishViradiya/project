//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React from 'react'

import { Button, ButtonGroup } from '@material-ui/core'

import { ChartTabPanel } from '../ChartTabs'
import { useChartTabs } from '../hooks/useChartTabs'
import { Toolbar } from '../widgets/toolbar'
import useStyles from './styles'

interface WidgetTabsProps {
  id: string
  defaultSelectedTabIndex?: number
  items: { component: React.ReactNode; label: string; hidden?: boolean; disabled?: boolean }[]
}

// the height of this component
export const WIDGET_TABS_HEIGHT = 30

const WidgetTabs: React.FC<WidgetTabsProps> = ({ id, defaultSelectedTabIndex = 0, items = [] }) => {
  const classes = useStyles()
  const { currentTabIndex, handleTabChange } = useChartTabs({ id, defaultIndex: defaultSelectedTabIndex })

  const { labels, components } = items
    .filter(item => !item.hidden)
    .reduce(
      (acc, item, index) => ({
        labels: [
          ...acc.labels,
          <Button onClick={handleTabChange} data-index={index} key={index} className={index === currentTabIndex ? 'selected' : ''}>
            {item.label}
          </Button>,
        ],

        components: [
          ...acc.components,
          <ChartTabPanel value={currentTabIndex} key={index} index={index}>
            {item.component}
          </ChartTabPanel>,
        ],
      }),
      { labels: [], components: [] },
    )

  return (
    <>
      <Toolbar
        begin={
          <ButtonGroup className={classes.content} size={'small'} disableRipple>
            {labels}
          </ButtonGroup>
        }
      />
      {components}
    </>
  )
}

export { WidgetTabs }
