/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect } from 'react'
import { useLocation, useMatch } from 'react-router-dom'

import { Box } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import { MobileProtectData } from '@ues-data/mtd'
import { Permission } from '@ues-data/shared'
import {
  buildLocationWithQuery,
  createDefaultFilters,
  hasParamsToCleanup,
  MobileAlertColumnNames,
  MobileAlertFilterNames,
  MtdAlertDrawer,
  useMobileAlertsCustomTable,
} from '@ues-mtd/shared'
import { AppliedFilterPanel, OPERATOR_VALUES, SecuredContent, TableProvider, TableToolbar } from '@ues/behaviours'

import useStyles from './styles'

const TABLE_NAME = 'mobileAlertsByDevice'
const FILTERED_TABLES = [MobileAlertColumnNames.DeviceName]

export const MobileAlertByDevice = React.memo(() => {
  const { outerContainer } = useStyles()
  const match = useMatch('/mobile-devices/:endpointId/alerts')
  const location = useLocation()
  const { search } = location

  const fixedFilters: Record<string, string> = React.useMemo(() => {
    if (match) {
      // interrogate path to obtain endpointId
      return { [MobileAlertFilterNames.EndpointId]: match.params.endpointId }
    }
    return {}
  }, [match])

  const [defaultFilters] = React.useState(
    Boolean(search) && search.length !== 0
      ? createDefaultFilters(search)
      : {
          [MobileAlertColumnNames.Status]: {
            operator: OPERATOR_VALUES.IS_IN,
            value: [MobileProtectData.MobileThreatEventState.NEW],
          },
        },
  )

  useEffect(() => {
    if (hasParamsToCleanup(new URLSearchParams(search))) {
      const locationWithQuery = buildLocationWithQuery(search)
      window.history.replaceState(null, '', locationWithQuery)
    }
  }, [search])

  const { tableProps, providerProps, filterPanelProps, drawerProps, toolbarProps } = useMobileAlertsCustomTable(
    TABLE_NAME,
    FILTERED_TABLES,
    fixedFilters,
    defaultFilters,
  )

  return (
    <Box className={outerContainer}>
      <SecuredContent requiredPermissions={Permission.MTD_EVENTS_READ}>
        <TableProvider {...providerProps}>
          <TableToolbar {...toolbarProps} bottom={<AppliedFilterPanel {...filterPanelProps} />} />
          <XGrid {...tableProps} />
        </TableProvider>
        <MtdAlertDrawer {...drawerProps} />
      </SecuredContent>
    </Box>
  )
})
