//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box, IconButton } from '@material-ui/core'

import type { Types } from '@ues-gateway/shared'
import { Components, Config, Data } from '@ues-gateway/shared'
import { BasicAddRound, BasicDelete, BasicEdit } from '@ues/assets'
import { AriaElementLabel } from '@ues/assets-e2e'
import type { TableColumn } from '@ues/behaviours'
import { BasicTable, TableProvider } from '@ues/behaviours'

import type { SplitTunnelingDialogProps } from './split-tunneling-dialog'
import SplitTunnelingDialog from './split-tunneling-dialog'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { EntityDetailsViewContext } = Components
const { getLocalPolicyData, getPolicyTask, getSplitTunnelingListItems, updateLocalPolicyData } = Data

const SplitTunnelingList: React.FC = () => {
  const [splitTunnelingDialogState, setSplitTunnelingDialogState] = useState<SplitTunnelingDialogProps>()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const listItems = useSelector(getSplitTunnelingListItems)
  const localPolicyData = useSelector(getLocalPolicyData)
  const policyTask = useSelector(getPolicyTask)
  const dispatch = useDispatch()
  const { writable } = useContext(EntityDetailsViewContext)

  const openSplitTunnelingDialog = (rowData?: Types.PolicyEditorListItem) =>
    setSplitTunnelingDialogState({
      dialogId: Symbol('dialog-id'),
      rowData,
    })

  const deleteSplitIpRange = (rowDataIndex: number) => {
    const update = [...(localPolicyData?.splitIpRanges ?? [])]
    update.splice(rowDataIndex, 1)
    dispatch(updateLocalPolicyData({ splitIpRanges: update }))
  }

  const columns: TableColumn<Types.PolicyEditorListItem>[] = [
    {
      label: t('policies.cidrAddresses'),
      dataKey: 'name',
    },
    {
      dataKey: 'action',
      renderLabel: () => (
        <Box display="flex" justifyContent="flex-end" width="100%">
          {writable && (
            <IconButton
              onClick={() => openSplitTunnelingDialog()}
              size="small"
              aria-label={AriaElementLabel.AddCidrAddressIconButton}
            >
              <BasicAddRound />
            </IconButton>
          )}
        </Box>
      ),
      renderCell: (rowData, rowDataIndex) => (
        <Box display="flex" justifyContent="flex-end">
          {writable && (
            <>
              <IconButton aria-label={t('common.buttonEdit')} onClick={() => openSplitTunnelingDialog(rowData)} size="small">
                <BasicEdit />
              </IconButton>
              <IconButton aria-label={t('common.buttonDelete')} onClick={() => deleteSplitIpRange(rowDataIndex)} size="small">
                <BasicDelete />
              </IconButton>
            </>
          )}
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
        <BasicTable data={listItems ?? []} noDataPlaceholder={t('common.noData')} />
      </TableProvider>

      <SplitTunnelingDialog {...splitTunnelingDialogState} />
    </>
  )
}

export default SplitTunnelingList
