/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { SyntheticEvent } from 'react'
import React from 'react'
import { useParams } from 'react-router-dom'

import { Box } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import type { EventBase } from '@ues-data/dlp'
import { Permission } from '@ues-data/shared'
import type { ToolbarProps } from '@ues/behaviours'
import { AppliedFilterPanel, TableProvider, TableToolbar, useSecuredContent } from '@ues/behaviours'

import makeStyles from '../../styles'
import { useEventListTableProps } from './useEventListTableProps'

type EventListProps = {
  onRowClick?: (data: EventBase, e: SyntheticEvent) => void
}

export const EventList = ({ onRowClick }: EventListProps) => {
  useSecuredContent(Permission.BIP_EVENT_READ)
  const { id: userId } = useParams()
  const classes = makeStyles()

  const props = userId
    ? {
        userId,
      }
    : {
        handleRowClick: (data, e) => {
          onRowClick(data, e)
        },
      }

  const { tableProps, providerProps, filterLabelProps } = useEventListTableProps(props)

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
