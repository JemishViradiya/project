//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { CONFLICT } from 'http-status-codes'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Button, IconButton, Link } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import type { NetworkServicesV2 } from '@ues-data/gateway'
import { useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Config, Data, Hooks, Utils } from '@ues-gateway/shared'
import { BasicAdd, BasicDelete, BasicEdit } from '@ues/assets'
import type { TableColumn, UseControlledDialogProps } from '@ues/behaviours'
import {
  ConfirmationState,
  TableProvider,
  TableSortDirection,
  TableToolbar,
  useClientSort,
  useConfirmation,
  useSort,
} from '@ues/behaviours'

import ServiceDetailsModal from './service-details-modal'
import ServiceEditModal from './service-edit-modal'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const {
  NetworkServicesV2: { mutationDeleteNetworkService, queryNetworkServices },
} = Data
const { BigService, useBigPermissions, useStatefulNotifications } = Hooks
const { isSystemNetworkService } = Utils

const idFunction = rowData => rowData.id

export const NetworkServicesList: React.FC = () => {
  const [serviceDetails, setServiceDetails] = useState<Partial<NetworkServicesV2.NetworkServiceEntity>>(null)
  const [dialogId, setDialogId] = useState<UseControlledDialogProps['dialogId']>(null)
  const [networkService, setNetworkService] = useState<Partial<NetworkServicesV2.NetworkServiceEntity>>({})
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const confirmation = useConfirmation()
  const { canCreate, canDelete, canUpdate } = useBigPermissions(BigService.NetworkServices)

  const { loading, data } = useStatefulReduxQuery(queryNetworkServices)

  const [deleteNetworkServiceStartAction, deleteNetworkServiceTask] = useStatefulNotifications(
    useStatefulReduxMutation(mutationDeleteNetworkService),
    {
      success: t('networkServices.deleteNetworkServiceSuccessMessage'),
      error: ({ error }) => {
        if (error?.response?.status === CONFLICT) {
          return t('networkServices.deleteNetworkServicePoliciesError', {
            entityNames: error?.response?.data?.data?.map(item => item.name),
          })
        } else {
          return t('networkServices.deleteNetworkServiceError')
        }
      },
    },
  )

  const serviceDetailsDialogId = serviceDetails ? Symbol(serviceDetails.id) : null

  const renderCell = (rowData: Partial<NetworkServicesV2.NetworkServiceEntity>) => {
    return canUpdate ? (
      <Link variant="inherit" color="primary" onClick={() => setServiceDetails(rowData)}>
        {rowData.name}
      </Link>
    ) : (
      rowData.name
    )
  }

  const onCloseModal = () => {
    setDialogId(null)
    setNetworkService({})
  }

  const onEdit = (item: Partial<NetworkServicesV2.NetworkServiceEntity>) => {
    const { name, ipRanges, fqdns, id } = item
    setNetworkService({ name, ipRanges, fqdns, id })
    setDialogId(Symbol('edit-modal-id'))
  }

  const handleRemove = async (item: Partial<NetworkServicesV2.NetworkServiceEntity>) => {
    const confirmationState = await confirmation({
      title: t('networkServices.titleDeleteConfirm'),
      description: t('common.doYouWantToDelete', { '0': item.name }),
      cancelButtonLabel: t('common.buttonCancel'),
      confirmButtonLabel: t('common.buttonDelete'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      deleteNetworkServiceStartAction({ networkServiceId: item.id })
    }
  }

  const columns: TableColumn<NetworkServicesV2.NetworkServiceEntity>[] = [
    {
      label: t('common.name'),
      dataKey: 'name',
      clientSortable: true,
      renderCell: renderCell,
      text: true,
    },
    {
      dataKey: 'action',
      icon: true,
      align: 'right',
      renderCell: rowData =>
        !isSystemNetworkService(rowData.tenantId) && (
          <Box display="flex" justifyContent="flex-end" width="100%">
            <>
              {canUpdate && (
                <IconButton
                  aria-label={t('common.buttonEdit')}
                  onClick={() => onEdit(rowData)}
                  disabled={deleteNetworkServiceTask.loading}
                  size="small"
                >
                  <BasicEdit />
                </IconButton>
              )}
              {canDelete && (
                <IconButton
                  aria-label={t('common.buttonDelete')}
                  onClick={() => handleRemove(rowData)}
                  disabled={deleteNetworkServiceTask.loading}
                  size="small"
                >
                  <BasicDelete />
                </IconButton>
              )}
            </>
          </Box>
        ),
    },
  ]

  const basicProps = { columns, idFunction }

  const sortProps = useSort('name', TableSortDirection.Asc)
  const { sort, sortDirection } = sortProps
  const sortedData = useClientSort({
    data: data || [],
    sort: { sortBy: sort, sortDir: sortDirection as TableSortDirection },
  })

  const tableProps = {
    getRowId: rowData => rowData.id,
    loading: loading,
    noRowsMessageKey: `${GATEWAY_TRANSLATIONS_KEY}:common.noData`,
    rows: sortedData,
    checkboxSelection: false,
  }

  return (
    <>
      <TableToolbar
        begin={
          canCreate && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setDialogId(Symbol('add-modal-id'))}
              startIcon={<BasicAdd />}
            >
              {t('common.buttonAdd')}
            </Button>
          )
        }
      />

      <TableProvider basicProps={basicProps} sortingProps={sortProps}>
        <XGrid {...tableProps} />
      </TableProvider>

      <ServiceEditModal dialogId={dialogId} initialValues={networkService} onClose={onCloseModal} />
      <ServiceDetailsModal dialogId={serviceDetailsDialogId} data={serviceDetails} onClose={() => setServiceDetails(null)} />
    </>
  )
}
