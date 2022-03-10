/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { SyntheticEvent } from 'react'
import React from 'react'

import { Box } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import type { FileInventoryBase } from '@ues-data/dlp'
import { Permission } from '@ues-data/shared'
import type { ToolbarProps } from '@ues/behaviours'
import { AppliedFilterPanel, TableProvider, TableToolbar, useSecuredContent } from '@ues/behaviours'

import makeStyles from '../styles'
import { useFileInventoryTableProps } from './useFileInventoryTableProps'

const FileInventoryList = ({ onRowClick }) => {
  useSecuredContent(Permission.BIP_FILESUMMARY_READ)
  const classes = makeStyles()

  const handleRowClick = (data: FileInventoryBase, e: SyntheticEvent) => {
    onRowClick(data, e)
  }

  const { tableProps, providerProps, filterLabelProps } = useFileInventoryTableProps({
    handleRowClick: handleRowClick,
  })

  const toolbarProps: ToolbarProps = {
    bottom: <AppliedFilterPanel {...providerProps.filterProps} {...filterLabelProps} />,
  }
  return (
    <Box className={classes.container}>
      <TableToolbar {...toolbarProps} />
      <TableProvider {...providerProps}>
        <XGrid {...tableProps} />
      </TableProvider>
    </Box>
  )
}

export default FileInventoryList
