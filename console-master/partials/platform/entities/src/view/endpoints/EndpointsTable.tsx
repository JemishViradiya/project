//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React, { memo } from 'react'

import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core'

import { Permission } from '@ues-data/shared-types'
import { TableProvider, useSecuredContent } from '@ues/behaviours'

import { Layout } from './Layout'
import { useDevicesTable } from './useDevicesTable'

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.snackbar,
  },
}))

const EndpointsTable: React.FC = memo(() => {
  useSecuredContent(Permission.ECS_DEVICES_READ)
  const { tableProps, providerProps, onDelete, showLoading, selectedCount, exportAction } = useDevicesTable()
  const { backdrop } = useStyles()

  return (
    <TableProvider {...providerProps}>
      <Layout tableProps={tableProps} selectedCount={selectedCount} onDelete={onDelete} exportAction={exportAction} />
      <Backdrop className={backdrop} open={showLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </TableProvider>
  )
})

export default EndpointsTable
