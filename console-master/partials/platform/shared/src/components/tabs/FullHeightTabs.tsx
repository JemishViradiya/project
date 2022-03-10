import React, { useEffect, useState } from 'react'

import type { TabsProps as MuiTabsProps } from '@material-ui/core'
import { makeStyles, Tab, Tabs } from '@material-ui/core'

export interface TabsProps extends Omit<MuiTabsProps, 'onChange'> {
  tabs: { tabContent: React.ReactNode; label: string; hidden?: boolean; disabled?: boolean }[]
  defaultSelectedTabIndex?: number
  onChange?: (selectedTabIndex: number) => void
  alwaysMount?: boolean
}

const useStyles = makeStyles(theme => ({
  tabs: {
    flex: 'none',
    '& .Mui-selected': {
      backgroundColor: 'transparent',
    },
    '& .MuiTab-root': {
      minWidth: 0,
    },
  },
  tabPanel: {
    flex: '1 1 auto',
    margin: theme.spacing(6),
  },
}))

export const FullHeightTabPanel = props => {
  const { children, value, index, alwaysMount, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`nav-tabpanel-${index}`} {...other}>
      {(value === index || alwaysMount) && children}
    </div>
  )
}

export const FullHeightTabs: React.FC<TabsProps> = ({
  tabs = [],
  alwaysMount = true,
  defaultSelectedTabIndex = 0,
  onChange,
}): JSX.Element => {
  const classes = useStyles()
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(defaultSelectedTabIndex)

  useEffect(() => {
    if (onChange) {
      onChange(selectedTabIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTabIndex])

  return (
    <>
      <Tabs onChange={(_, newValue) => setSelectedTabIndex(newValue)} value={selectedTabIndex} classes={{ root: classes.tabs }}>
        {tabs.map(({ label }) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      {tabs.map(({ tabContent }, index) => (
        <FullHeightTabPanel
          key={`tabpanel-${index}`}
          value={selectedTabIndex}
          index={index}
          alwaysMount={alwaysMount ?? false}
          className={classes.tabPanel}
        >
          {tabContent}
        </FullHeightTabPanel>
      ))}
    </>
  )
}
