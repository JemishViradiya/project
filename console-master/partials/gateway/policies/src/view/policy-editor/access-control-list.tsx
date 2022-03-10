//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box, IconButton } from '@material-ui/core'

import type { AccessControlType } from '@ues-data/gateway'
import { AccessControlBlockType } from '@ues-data/gateway'
import type { Types } from '@ues-gateway/shared'
import { Components, Config, Data } from '@ues-gateway/shared'
import { BasicDelete, BasicEdit } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import { BasicTable, TableProvider } from '@ues/behaviours'

import type { AccessControlDialogProps } from './access-control-dialog'
import AccessControlDialog from './access-control-dialog'

interface AccessControlListProps {
  accessControlType: AccessControlType
  data: Types.AccessControlListItem[]
}

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { EntityDetailsViewContext, Dropdown } = Components
const { getLocalPolicyData, getPolicyTask, updateLocalPolicyData } = Data

const AccessControlList: React.FC<AccessControlListProps> = ({ accessControlType, data }) => {
  const [accessControlDialogState, setAccessControlDialogState] = useState<AccessControlDialogProps>()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const localPolicyData = useSelector(getLocalPolicyData)
  const policyTask = useSelector(getPolicyTask)
  const dispatch = useDispatch()
  const { writable } = useContext(EntityDetailsViewContext)

  const openAccessControlDialog = (type: AccessControlBlockType, rowData?: Types.AccessControlListItem) => {
    setAccessControlDialogState({
      dialogId: Symbol('dialog-id'),
      accessControlType,
      accessControlBlockType: type,
      rowData,
    })
  }

  const deleteAccessControlBlock = (rowData: Types.AccessControlListItem): void => {
    const update = [...(localPolicyData?.[accessControlType]?.[rowData.type] ?? [])]

    update.splice(rowData.indexInParentArray, 1)

    dispatch(
      updateLocalPolicyData({
        [accessControlType]: {
          ...(localPolicyData?.[accessControlType] ?? {}),
          [rowData.type]: update,
        },
      }),
    )
  }

  const columns: TableColumn<Types.AccessControlListItem>[] = [
    {
      label: t('common.host'),
      dataKey: 'name',
      persistent: true,
    },
    {
      dataKey: 'action',
      renderLabel: () =>
        writable && (
          <Box display="flex" justifyContent="flex-end" width="100%">
            <Dropdown
              items={[
                {
                  label: t('common.networkServices'),
                  onClick: () => openAccessControlDialog(AccessControlBlockType.NetworkServices),
                },
                {
                  label: t('common.ipAddressesRangesCidrs'),
                  onClick: () => openAccessControlDialog(AccessControlBlockType.IpRanges),
                },
                {
                  label: t('common.fqdn'),
                  onClick: () => openAccessControlDialog(AccessControlBlockType.Fqdns),
                },
              ]}
            />
          </Box>
        ),
      renderCell: rowData =>
        writable && (
          <Box display="flex" justifyContent="flex-end">
            <IconButton
              aria-label={t('common.buttonEdit')}
              onClick={() => openAccessControlDialog(rowData.type, rowData)}
              size="small"
            >
              <BasicEdit />
            </IconButton>
            <IconButton aria-label={t('common.buttonDelete')} onClick={() => deleteAccessControlBlock(rowData)} size="small">
              <BasicDelete />
            </IconButton>
          </Box>
        ),
    },
  ]

  const idFunction = rowData => rowData.value

  const basicProps = {
    columns,
    idFunction,
    loading: policyTask?.loading,
  }

  return (
    <>
      <TableProvider basicProps={basicProps}>
        <BasicTable data={data ?? []} noDataPlaceholder={t('common.noData')} />
      </TableProvider>
      <AccessControlDialog {...accessControlDialogState} />
    </>
  )
}
export default AccessControlList
