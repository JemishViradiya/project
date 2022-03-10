import React, { useState } from 'react'

import type { TabsProps as MuiTabsProps } from '@material-ui/core'
import { Button, ButtonGroup, makeStyles } from '@material-ui/core'

export interface TabsProps extends Omit<MuiTabsProps, 'onChange'> {
  tabs: { tabContent: React.ReactNode; label: string; id: number; hidden?: boolean; disabled?: boolean }[]
  defaultSelectedTabIndex?: number
  alwaysMount?: boolean
}

const useStyles = makeStyles(theme => ({
  tabPanel: {
    flex: '1 1 auto',
  },
}))

const TabPanel = props => {
  const { children, value, selectedId, alwaysMount, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== selectedId} id={`tabpanel-${value}`} key={value} {...other}>
      {(value === selectedId || alwaysMount) && children}
    </div>
  )
}

const ButtonGroupTabs: React.FC<TabsProps> = ({ tabs = [], defaultSelectedTabIndex = 0, alwaysMount = true }): JSX.Element => {
  const classes = useStyles()
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(defaultSelectedTabIndex)

  return (
    <>
      <ButtonGroup>
        {tabs.map(({ label, id }) => (
          <Button
            key={id}
            value={id}
            className={selectedTabIndex === id ? 'selected' : ''}
            onClick={() => {
              setSelectedTabIndex(id)
            }}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
      {tabs.map(({ tabContent, id }) => (
        <TabPanel className={classes.tabPanel} value={id} selectedId={selectedTabIndex} key={`tabPanel${id}`} alwaysMount>
          {tabContent}
        </TabPanel>
      ))}
    </>
  )
}

export default ButtonGroupTabs
