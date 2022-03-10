/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo } from 'react'

import { Box, Card } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import { MtdAlertDrawer } from '@ues-mtd/shared'
import { AppliedFilterPanel, ConfirmationDialog, TableProvider, TableToolbar } from '@ues/behaviours'

import useStyles from '../styles'
import { useMobileAlertsTable } from './useMobileAlertsTable'

const MobileAlertsTable: React.FC = memo(() => {
  const { tableProps, toolbarProps, providerProps, filterPanelProps, confirmationOptions, drawerProps } = useMobileAlertsTable()
  const { outerContainer, paperContainer } = useStyles()

  return (
    <Box className={outerContainer}>
      <Card variant="outlined" className={paperContainer}>
        <TableProvider {...providerProps}>
          <TableToolbar {...toolbarProps} bottom={<AppliedFilterPanel {...filterPanelProps} />} />
          <XGrid {...tableProps} />
        </TableProvider>
      </Card>
      <MtdAlertDrawer {...drawerProps} />
      <ConfirmationDialog {...confirmationOptions} />
    </Box>
  )
})

export default MobileAlertsTable
