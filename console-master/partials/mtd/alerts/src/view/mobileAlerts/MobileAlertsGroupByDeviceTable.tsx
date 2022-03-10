/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { Box, Card } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import { AppliedFilterPanel, TableProvider, TableToolbar } from '@ues/behaviours'

import useStyles from '../styles'
import { useMobileAlertsGroupByDeviceTable } from './useMobileAlertsGroupByDeviceTable'

const MobileAlertsGroupByDeviceTable = React.memo(() => {
  const { tableProps, toolbarProps, providerProps, filterPanelProps } = useMobileAlertsGroupByDeviceTable()
  const { outerContainer, paperContainer } = useStyles()

  return (
    <Box className={outerContainer}>
      <Card variant="outlined" className={paperContainer}>
        <TableProvider {...providerProps}>
          <TableToolbar {...toolbarProps} bottom={<AppliedFilterPanel {...filterPanelProps} />} />
          <XGrid {...tableProps} />
        </TableProvider>
      </Card>
    </Box>
  )
})

export default MobileAlertsGroupByDeviceTable
