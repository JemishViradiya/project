import { useFlags } from 'launchdarkly-react-client-sdk'
import React from 'react'
import { useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

const useStyles = makeStyles({
  tabs: {
    'font-size': '16px',
  },
  hidden: {
    display: 'none',
  },
})

export default function MaterialTabs(props) {
  const { tabs } = props
  const classes = useStyles()

  const currentTab = () => {
    const path = window.location.hash.split('#').slice(1).join('')
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].url.toString() === path) {
        return i
      }
    }
  }

  const [value, setValue] = React.useState(currentTab() ? currentTab() : 0)
  const history = useHistory()
  const flags = useFlags()

  const handleChange = (event, newValue) => {
    setValue(newValue)
    history.push(props.tabs[newValue].url)
  }

  function flagCheck(item) {
    if (item.featureFlag !== undefined) {
      return flags[item.featureFlag] && props[item.permissions]
    } else if (item.featureFlag === undefined && props[item.permissions] !== undefined) {
      return props[item.permissions]
    } else {
      return true
    }
  }

  return (
    <div>
      <Tabs value={currentTab() === undefined ? value : currentTab()} onChange={handleChange}>
        {tabs.map(item =>
          flagCheck(item) ? (
            <Tab
              key={item.alias}
              classes={{
                root: classes.tabs,
              }}
              label={item.alias}
              url={item.url}
            />
          ) : (
            <Tab key={item.alias} style={{ display: 'none' }} />
          ),
        )}
      </Tabs>
    </div>
  )
}
