//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, IconButton } from '@material-ui/core'

import type { Types } from '@ues-gateway/shared'
import { Config, Data, Hooks } from '@ues-gateway/shared'
import { BasicAdd, BasicClose, BasicEdit } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import { BasicTable, TableProvider, TableSortDirection, TableToolbar, useClientSort, useSort } from '@ues/behaviours'

import type { SourceIpDialogProps } from './source-ip-dialog'
import SourceIpDialog from './source-ip-dialog'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalTenantConfig, getTenantConfigurationTask, updateLocalTenantConfig } = Data
const { BigService, useBigPermissions } = Hooks

const idFunction = rowData => rowData.ip

const SourceIpList: React.FC = () => {
  const [dialogState, setDialogState] = useState<SourceIpDialogProps>()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()
  const { canUpdate } = useBigPermissions(BigService.Tenant)
  const tenantConfigurationTask = useSelector(getTenantConfigurationTask)
  const localTenantConfig = useSelector(getLocalTenantConfig)

  const openDialog = (rowData: Types.IpAddressesListItem) =>
    setDialogState({
      dialogId: Symbol('dialog-id'),
      rowData,
    })

  const deleteSourceIp = (rowDataIndex: number) => {
    const update = [...(localTenantConfig?.egressSourceIPRestrictionIPs ?? [])]

    update.splice(rowDataIndex, 1)

    dispatch(updateLocalTenantConfig({ egressSourceIPRestrictionIPs: update }))
  }

  const tableData = (localTenantConfig?.egressSourceIPRestrictionIPs ?? []).map((ip: string, index: number) => ({ ip, id: index }))

  const columns: TableColumn[] = [
    {
      label: t('common.ipAddresses'),
      dataKey: 'ip',
      sortable: true,
    },
    {
      dataKey: 'action',
      icon: true,
      align: 'right',
      renderCell: (rowData, rowDataIndex) => (
        <Box display="flex" justifyContent="flex-end">
          {canUpdate && (
            <>
              <IconButton aria-label={t('common.buttonEdit')} onClick={() => openDialog(rowData)} size="small">
                <BasicEdit />
              </IconButton>
              <IconButton aria-label={t('common.buttonDelete')} onClick={() => deleteSourceIp(rowDataIndex)} size="small">
                <BasicClose />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ]

  const basicProps = {
    columns,
    idFunction,
    loading: tenantConfigurationTask?.loading,
  }

  const sortProps = useSort(null, TableSortDirection.Asc)
  const { sort, sortDirection } = sortProps
  const sortedData = useClientSort({ data: tableData, sort: { sortBy: sort, sortDir: sortDirection as TableSortDirection } })

  return (
    <>
      <TableToolbar
        begin={
          canUpdate && (
            <Button variant="contained" color="secondary" onClick={() => openDialog(null)} startIcon={<BasicAdd />}>
              {t('common.ipAddressAdd')}
            </Button>
          )
        }
      />

      <TableProvider basicProps={basicProps} sortingProps={sortProps}>
        <BasicTable data={sortedData} noDataPlaceholder={t('common.noData')} />
      </TableProvider>

      <SourceIpDialog {...dialogState} />
    </>
  )
}

export default SourceIpList
