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
import { DraggableTable, DraggableTableProvider, TableToolbar, useDraggableTable } from '@ues/behaviours'

import type { DnsSuffixesDialogProps } from './dns-suffixes-dialog'
import DnsSuffixesDialog from './dns-suffixes-dialog'

const { GATEWAY_TRANSLATIONS_KEY, MAX_DNS_SUFFIXES_COUNT } = Config
const { getLocalTenantConfig, getTenantConfigurationTask, updateLocalTenantConfig } = Data
const { BigService, useBigPermissions } = Hooks

const idFunction = rowData => rowData.name

const DnsSuffixesList: React.FC = () => {
  const [dnsSuffixesDialogProps, setDnsSuffixesDialogProps] = useState<DnsSuffixesDialogProps>()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const tenantConfigurationTask = useSelector(getTenantConfigurationTask)
  const localTenantConfig = useSelector(getLocalTenantConfig)
  const dispatch = useDispatch()
  const { canUpdate } = useBigPermissions(BigService.Tenant)

  const openDnsSuffixesDialog = (rowData?: Types.DnsSuffixesListItem, rowDataIndex?: number) =>
    setDnsSuffixesDialogProps({
      dialogId: Symbol('dialog-id'),
      rowData,
      rowDataIndex,
    })

  const incrementOrder = (index: number) => index + 1

  const deleteDnsSuffix = (rowDataIndex: number) => {
    const update = [...(localTenantConfig?.dnsSuffix ?? [])]

    update.splice(rowDataIndex, 1)

    dispatch(updateLocalTenantConfig({ dnsSuffix: update }))
  }

  const shouldHideAddButton = localTenantConfig?.dnsSuffix?.length >= MAX_DNS_SUFFIXES_COUNT

  const tableData = (localTenantConfig?.dnsSuffix ?? []).map((item, index) => ({ order: incrementOrder(index), name: item }))
  const columns: TableColumn[] = [
    {
      label: t('dns.dnsSuffixOrder'),
      dataKey: 'order',
    },
    {
      label: t('common.domain'),
      dataKey: 'name',
    },
    {
      dataKey: 'dnsSuffixesActions',
      icon: true,
      align: 'right',
      renderCell: (rowData, rowDataIndex) => (
        <Box display="flex" justifyContent="flex-end">
          {canUpdate && (
            <>
              <IconButton
                aria-label={t('common.buttonEdit')}
                onClick={() => openDnsSuffixesDialog(rowData, rowDataIndex)}
                size="small"
              >
                <BasicEdit />
              </IconButton>
              <IconButton aria-label={t('common.buttonDelete')} onClick={() => deleteDnsSuffix(rowDataIndex)} size="small">
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

  const { draggableProps } = useDraggableTable({
    initialData: tableData,
    idFunction,
    draggable: {
      onDragChange: ({ updatedDataSource }) =>
        dispatch(
          updateLocalTenantConfig({
            dnsSuffix: updatedDataSource.map(item => item.name),
          }),
        ),
      onDataReorder: (rowData, index) => ({
        ...rowData,
        order: incrementOrder(index),
      }),
      hidden: tableData.length === 1,
    },
  })

  return (
    <>
      <TableToolbar
        begin={
          canUpdate && (
            <Button
              disabled={shouldHideAddButton}
              variant="contained"
              color="secondary"
              onClick={() => openDnsSuffixesDialog()}
              startIcon={<BasicAdd />}
            >
              {t('dns.dnsSuffixAdd')}
            </Button>
          )
        }
      />

      <DraggableTableProvider basicProps={basicProps} draggableProps={draggableProps}>
        <DraggableTable data={tableData} noDataPlaceholder={t('common.noData')} />
      </DraggableTableProvider>

      <DnsSuffixesDialog {...dnsSuffixesDialogProps} />
    </>
  )
}

export default DnsSuffixesList
