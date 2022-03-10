//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Button, IconButton, Link, Tooltip, Typography } from '@material-ui/core'

import type { ConnectorConfigInfo, ConnectorHealthStatus } from '@ues-data/gateway'
import { Permission, useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'
import { BasicAdd, BasicInfo } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import {
  BasicTable,
  TableProvider,
  TableSortDirection,
  TableToolbar,
  useClientSort,
  useSecuredContent,
  useSort,
} from '@ues/behaviours'

import type { AddConnectorDialogProps } from './add-connector-dialog'
import AddConnectorDialog from './add-connector-dialog'

const { ConnectorStatusIndicator, ConnectorStatusLabelType } = Components
const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getConnectorsTask, queryConnectors } = Data
const { BigService, useBigPermissions, useStatefulNotifications } = Hooks
const { Page } = Types
const { makePageRoute } = Utils

const idFunction = rowData => rowData.connectorId

/**
 * @description This component enumerates existing gateway connectors.
 */
const ConnectorsList: React.FC = () => {
  useSecuredContent(Permission.BIG_TENANT_READ)
  const [addDialogState, setDialogState] = useState<AddConnectorDialogProps>()
  const navigate = useNavigate()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { canCreate } = useBigPermissions(BigService.Tenant)

  const connectorsTask = useSelector(getConnectorsTask)

  useStatefulNotifications(useStatefulReduxQuery(queryConnectors), {
    error: ({ error }) => error?.message,
  })

  const openAddDialog = () =>
    setDialogState({
      dialogId: Symbol('AddDialogSymbolId'),
    })

  const renderHealthStatus = (rowData: Partial<ConnectorConfigInfo>) => (
    <ConnectorStatusIndicator
      boxProps={{ margin: 0, marginLeft: 0 }}
      connector={rowData}
      labelType={ConnectorStatusLabelType.Status}
    />
  )

  const getPassRate = (passed: number, total: number): string => `${t('connectors.passCount', { passed, total })}`

  const renderPassRateCell = (rowData: Partial<ConnectorConfigInfo>, predicate: (item: ConnectorHealthStatus) => boolean) => {
    const filtered = !isEmpty(rowData?.healthStatus) ? rowData.healthStatus.filter(predicate) : []

    return (
      <Typography>{!isEmpty(rowData?.healthStatus) ? getPassRate(filtered.length, rowData?.healthStatus?.length) : '-'}</Typography>
    )
  }

  const columns: TableColumn[] = [
    {
      label: t('common.name'),
      dataKey: 'name',
      persistent: true,
      sortable: true,
      renderCell: connector => (
        <Link
          variant="inherit"
          color="primary"
          onClick={() => navigate(makePageRoute(Page.GatewaySettingsConnectorEdit, { params: { id: connector.connectorId } }))}
        >
          {connector.name}
        </Link>
      ),
      gridColDefProps: { flex: 2 },
    },
    {
      label: t('connectors.labelTunnel'),
      dataKey: 'tunnel',
      gridColDefProps: { flex: 1 },
      renderCell: rowData => renderPassRateCell(rowData, item => item?.tunnel === true),
    },
    {
      label: t('connectors.labelDNS'),
      dataKey: 'dns',
      gridColDefProps: { flex: 1 },
      renderCell: rowData => renderPassRateCell(rowData, item => item?.DNS === true),
    },
    {
      label: t('connectors.labelHTTP'),
      dataKey: 'http',
      gridColDefProps: { flex: 1 },
      renderCell: rowData => renderPassRateCell(rowData, item => item?.testPage >= 200 && item?.testPage < 300),
    },
    {
      label: t('common.labelStatus'),
      dataKey: 'health',
      gridColDefProps: { flex: 2 },
      renderCell: renderHealthStatus,
    },
    {
      renderLabel: () => (
        <>
          {t('connectors.rebootRequired')}
          <Tooltip title={t('connectors.rebootRequiredTooltip')} placement="top" enterDelay={600}>
            <IconButton size="small">
              <BasicInfo />
            </IconButton>
          </Tooltip>
        </>
      ),
      dataKey: 'upgradeAvailable',
      gridColDefProps: { flex: 1 },
      renderCell: row => row?.upgradeAvailable && t('common.yes'),
    },
  ]

  const basicProps = {
    columns,
    idFunction,
    loading: connectorsTask?.loading,
  }

  const sortProps = useSort(null, TableSortDirection.Asc)
  const { sort, sortDirection } = sortProps
  const sortedData = useClientSort({
    data: connectorsTask?.data ?? [],
    sort: { sortBy: sort, sortDir: sortDirection as TableSortDirection },
  })

  return (
    <>
      <Typography variant="subtitle2">{t('connectors.connectorsListDescription')}</Typography>
      <TableToolbar
        begin={
          canCreate && (
            <Button variant="contained" color="secondary" onClick={openAddDialog} startIcon={<BasicAdd />}>
              {t('connectors.addConnector')}
            </Button>
          )
        }
      />
      <TableProvider basicProps={basicProps} sortingProps={sortProps}>
        <BasicTable data={sortedData} noDataPlaceholder={t('common.noData')} />
      </TableProvider>
      <AddConnectorDialog {...addDialogState} />
    </>
  )
}

export default ConnectorsList
