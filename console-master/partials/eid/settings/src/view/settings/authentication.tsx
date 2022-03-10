import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TabContext from '@material-ui/lab/TabContext'
import TabList from '@material-ui/lab/TabList'
import TabPanel from '@material-ui/lab/TabPanel'

import AuthorizedApps from './apps'
import Authenticators from './authenticators'

const Authentication = React.memo(() => {
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const [value, setValue] = React.useState('1')
  const { t } = useTranslation(['eid/common'])

  return <Authenticators />
})
Authentication.displayName = 'authentication'

export default Authentication
