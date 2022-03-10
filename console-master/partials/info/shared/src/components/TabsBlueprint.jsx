import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Tab, Tabs } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={1}>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

export const TabsBlueprint = ({ tabMaps }) => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const { t } = useTranslation(['dlp/common'])

  return (
    <>
      <Tabs value={value} onChange={handleChange} aria-label="tabs blueprint">
        {tabMaps.map((tabMap, idx) => (
          <Tab key={'key' + idx} label={t('setting.' + tabMap.name)} />
        ))}
      </Tabs>
      <Divider />
      {tabMaps.map((tabMap, idx) => (
        <TabPanel key={'key' + idx} value={value} index={idx}>
          {tabMap.component}
        </TabPanel>
      ))}
    </>
  )
}
