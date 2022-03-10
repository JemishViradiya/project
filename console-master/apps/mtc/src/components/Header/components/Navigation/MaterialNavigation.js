import { useFlags } from 'launchdarkly-react-client-sdk'
import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles({
  iconTabContainer: {
    height: '100%',
  },
  tooltip: {
    'background-color': '#131618',
    padding: '10px 15px',
    fontSize: '16px !important',
    'border-radius': '0px',
  },
  tooltipLocation: {
    margin: '0px',
  },
  tabs: {
    height: '100%',
  },
  flexContainer: {
    height: '100%',
  },
  indicator: {
    display: 'none',
  },
  tab: {
    display: 'flex',
    'flex-direction': 'column',
    'border-right': '2px solid #3D4144',
    margin: '0px !important',
    'margin-right': '0px',
    '&:hover': {
      '&::before': {
        color: '#FFFFFF',
      },
      'background-color': '#131618',
    },
    '&::before': {
      'font-size': '26px',
      color: '#BABBC0',
      'font-weight': '300',
      margin: '0px 9px',
    },
  },
  selected: {
    'background-color': '#131618',
    '&::before': {
      color: '#FFFFFF',
    },
  },
  labelIcon: {
    color: '#ffffff',
  },
  paper: {
    width: 'auto',
    'text-align': 'center',
    padding: '15px',
    'background-color': '#131618',
    color: '#ffffff',
    'font-size': '16px',
    'border-radius': '0px !important',
  },
})

function IconTabs(props) {
  const classes = useStyles()
  const history = useHistory()
  const flags = useFlags()

  const iconTabs = [
    {
      id: 0,
      url: '/tenant',
      icon: 'icon-highrise',
      label: 'Tenants',
      permissions: props.tenantList,
    },
    {
      id: 1,
      url: '/user',
      icon: 'icon-users',
      label: 'Partner Users',
      permissions: props.userList,
    },
    {
      id: 2,
      url: '/partner',
      icon: 'icon-buildings',
      label: 'Partners',
      permissions: props.partnerList,
    },
    {
      id: 3,
      url: '/reports',
      icon: 'icon-bar-chart-solid',
      label: 'Reports',
      permissions: props.reportRead,
    },
    {
      id: 4,
      url: '/settings',
      icon: 'icon-slider',
      label: 'Settings',
      partnerApp: 'partnerApp',
      permissions: [props.policyTemplateList, props.partnerAppListPermission],
    },
  ]

  const currentTab = () => {
    const path = window.location.hash
    for (let i = 0; i < iconTabs.length; i++) {
      if (path.includes(iconTabs[i].url)) {
        return i
      }
    }
  }

  const partnerAppCheck = item => {
    if (flags[item.flags] && item.permissions) {
      return flags[item.flags] && item.permissions
    } else {
      return false
    }
  }

  const flagCheck = item => {
    if (item.flags === undefined) {
      if (Array.isArray(item.permissions)) {
        return item.permissions.includes(true)
      } else {
        return item.permissions
      }
    } else {
      for (let i = 0; i < item.flags.length; i++) {
        if (flags[item.flags[i]] && item.permissions[i]) {
          return true
        } else {
          partnerAppCheck(item.flags[i])
        }
      }
    }
  }

  const [value, setValue] = React.useState(currentTab() ? currentTab() : 0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
    history.push(iconTabs[newValue].url)
  }

  return (
    <div className={classes.iconTabContainer}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        classes={{
          root: classes.tabs,
          flexContainer: classes.flexContainer,
          indicator: classes.indicator,
        }}
      >
        {iconTabs.map(item => {
          return flagCheck(item) ? (
            <Tooltip
              key={item.id}
              title={item.label}
              placement="bottom-start"
              classes={{
                tooltip: classes.tooltip,
                tooltipPlacementBottom: classes.tooltipLocation,
              }}
            >
              <Tab
                className={item.icon}
                classes={{
                  root: classes.tab,
                  selected: classes.selected,
                  labelIcon: classes.labelIcon,
                }}
                url={item.url}
                itemlabel={item.label}
              />
            </Tooltip>
          ) : (
            <Tab key={item.id} style={{ display: 'none' }} />
          )
        })}
      </Tabs>
    </div>
  )
}

const mapStateToProps = state => ({
  policyTemplateList: !!state.auth.permissions['policy-template:list'],
  tenantList: state.auth.permissions['tenant:list'],
  userList: state.auth.permissions['user:list'],
  partnerList: state.auth.permissions['partner:list'],
  reportRead: state.auth.permissions['report:read'],
  partnerAppListPermission: !!state.auth.permissions['partner-app:list'],
})

export default connect(mapStateToProps, null)(IconTabs)
