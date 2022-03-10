//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, IconButton } from '@material-ui/core'

import { Config, Data, Hooks, Utils } from '@ues-gateway/shared'
import { BasicAdd, BasicClose, BasicEdit } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import { BasicTable, TableProvider, TableToolbar } from '@ues/behaviours'

import { TenantStickyActions } from '../../../../components'
import { PICK_TENANT_CONFIG_PROPERTIES } from '../../../constants'
import type { RouteModalDialogProps } from './route-modal'
import RouteModalDialog from './route-modal'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalTenantConfig, updateLocalTenantConfig } = Data
const { BigService, useBigPermissions } = Hooks
const { IPType } = Utils

const idFunction = rowData => rowData.ip

const Routing: React.FC = () => {
  const [dialogProps, setDialogProps] = useState<RouteModalDialogProps>()
  const { privateNetworkIpV4Ranges, privateNetworkIpV6Ranges } = useSelector(getLocalTenantConfig)
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()
  const { canUpdate } = useBigPermissions(BigService.Tenant)

  const deleteRoute = ({ id }) => {
    const updatedPrivateNetworkIpV4Ranges = privateNetworkIpV4Ranges ? [...privateNetworkIpV4Ranges] : []
    const updatedPrivateNetworkIpV6Ranges = privateNetworkIpV6Ranges ? [...privateNetworkIpV6Ranges] : []
    const [ver, index] = id.split('@@')
    const ranges = ver === IPType.IPv4 ? updatedPrivateNetworkIpV4Ranges : updatedPrivateNetworkIpV6Ranges

    ranges.splice(index, 1)

    const update = {
      privateNetworkIpV4Ranges: updatedPrivateNetworkIpV4Ranges,
      privateNetworkIpV6Ranges: updatedPrivateNetworkIpV6Ranges,
    }

    dispatch(updateLocalTenantConfig(update))
  }

  const tableData = [
    ...(privateNetworkIpV4Ranges || []).map((item, index) => ({
      ip: item,
      id: `${IPType.IPv4}@@${index}`,
    })),
    ...(privateNetworkIpV6Ranges || []).map((item, index) => ({
      ip: item,
      id: `${IPType.IPv6}@@${index}`,
    })),
  ]

  const columns: TableColumn[] = [
    {
      label: t('common.ipAddresses'),
      dataKey: 'ip',
    },
    {
      dataKey: 'action',
      icon: true,
      align: 'right',
      renderCell: rowData => (
        <Box display="flex" justifyContent="flex-end">
          {canUpdate && (
            <>
              <IconButton
                aria-label={t('common.buttonEdit')}
                onClick={() => {
                  setDialogProps({
                    dialogId: Symbol('route-dialog'),
                    values: rowData,
                  })
                }}
                size="small"
              >
                <BasicEdit />
              </IconButton>
              <IconButton aria-label={t('common.buttonDelete')} onClick={() => deleteRoute(rowData)} size="small">
                <BasicClose />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ]

  const basicProps = { columns, idFunction }

  return (
    <>
      <TableToolbar
        begin={
          canUpdate && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() =>
                setDialogProps({
                  dialogId: Symbol('route-dialog'),
                })
              }
              startIcon={<BasicAdd />}
            >
              {t('privateNetwork.labelAddRoute')}
            </Button>
          )
        }
      />
      <TableProvider basicProps={basicProps}>
        <BasicTable data={tableData ?? []} noDataPlaceholder={t('common.noData')} />
      </TableProvider>
      <RouteModalDialog {...dialogProps} />
      <TenantStickyActions tenantConfigurationKeys={PICK_TENANT_CONFIG_PROPERTIES.privateNetworkRouting} />
    </>
  )
}

export default Routing
