import React, { memo } from 'react'

import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import MaterialTabs from '@material-ui/core/Tabs'

const Tabs = memo(({ children, ...materialTabsProps }) => {
  return (
    <Box mb={4}>
      <MaterialTabs {...materialTabsProps}>{children}</MaterialTabs>
      <Divider />
    </Box>
  )
})

export default Tabs
