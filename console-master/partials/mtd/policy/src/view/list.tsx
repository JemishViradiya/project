/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
/* eslint-disable sonarjs/cognitive-complexity*/
import type { VariantType } from 'notistack'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Typography } from '@material-ui/core'

import { MtdPolicies } from '@ues-data/mtd'
import { useBaseProfilesData } from '@ues-data/platform'
import { FeatureName, Permission, ReconciliationEntityType, ServiceId, UesReduxStore, usePermissions } from '@ues-data/shared'
import { useDeleteProfilesConfirmation, useProfilesList, useProfilesListToolbar, useRankable } from '@ues-platform/policy-common'
import {
  ConfirmationDialog,
  DraggableTable,
  DraggableTableProvider,
  FormButtonPanel,
  TableToolbar,
  useConfirmation,
  useDialogPrompt,
  useFeatureCheck,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import { getI18PolicyOperationError } from './common/i18n'
import { ENQUEUE_TYPE } from './common/notification'
import { QUERY_STRING_PARM, UPDATE_TABS } from './common/settings'
import { PRECONDITION_SUBSTATUS } from './common/validate'

const { DeletePolicies, ResetPolicy } = MtdPolicies

UesReduxStore.mountSlice(MtdPolicies.slice)

const serviceId = ServiceId.MTD
const entityType = ReconciliationEntityType.MTD

const PolicyList = React.memo(() => {
  useSecuredContent(Permission.MTD_POLICY_READ)
  useFeatureCheck(isEnabled => isEnabled(FeatureName.MobileThreatDetection) && isEnabled(FeatureName.UESCronosNavigation))
  const { hasPermission } = usePermissions()
  const canDelete = hasPermission(Permission.MTD_POLICY_DELETE)
  const canCreate = hasPermission(Permission.MTD_POLICY_CREATE)
  const canUpdate = hasPermission(Permission.MTD_POLICY_UPDATE)

  const { t } = useTranslation(['mtd/common', 'profiles'])
  const { t: gatewayT } = useTranslation(['gateway/common'])
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()
  const dispatch = useDispatch()
  const { error, deletePayload } = useSelector(MtdPolicies.selectPolicy)
  const [profilesToDelete, setProfilesToDelete] = useState([])
  const [rankingSaved, setRankingSaved] = useState<boolean>(true)

  // console.log('MTD PolicyList: ', { deleting, error, deletePayload })

  const notify = (message: string, type: VariantType) => {
    snackbar.enqueueMessage(message, type)
  }

  const { profilesData, profilesLoading, updateRank, refetchProfiles } = useBaseProfilesData(serviceId, entityType, notify)

  useEffect(() => {
    if (error) {
      snackbar.enqueueMessage(t(getI18PolicyOperationError('deletePolicies')), ENQUEUE_TYPE.ERROR)
      dispatch(ResetPolicy())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const { unselectAll, tableProps, providerProps, rankMode, setRankMode, selectedItems, handleSearch, resetDrag } = useProfilesList(
    {
      rankable: true,
      getNamePath: policy => `../../protectMobile/update/${policy.entityId}`,
      getUsersPath: policy =>
        `../../protectMobile/update/${policy.entityId}?${QUERY_STRING_PARM.TAB}=${UPDATE_TABS.USERS_AND_GROUPS}`,
      getGroupsPath: policy =>
        `../../protectMobile/update/${policy.entityId}?${QUERY_STRING_PARM.TAB}=${UPDATE_TABS.USERS_AND_GROUPS}`,
      data: profilesData?.profiles?.elements ?? [],
      setRankingSaved,
      selectionEnabled: canDelete,
      loading: profilesLoading,
      tableName: entityType,
    },
  )

  const confirm = async (operation: string) => {
    const ids = deletePayload.failedDetails.map(d => d.entityId)
    await confirmation({
      title: t(`policy.${operation}.title`),
      description: t(`policy.${operation}.description`),
      cancelButtonLabel: t(`policy.${operation}.cancelButton`),
      content: (
        <div>
          {profilesToDelete
            .filter(p => ids.includes(p.entityId))
            .map(s => (
              <Typography variant="h4" key={s['name']}>
                {s['name']}
              </Typography>
            ))}
        </div>
      ),
    })
  }

  useEffect(() => {
    if (deletePayload) {
      if (deletePayload.failedCount === 0) {
        snackbar.enqueueMessage(t('policy.list.deleteSuccess'), ENQUEUE_TYPE.SUCCESS)
      } else {
        if (deletePayload.failedCount === 1 && deletePayload.totalCount === 1) {
          snackbar.enqueueMessage(t('policy.serverError.delete'), ENQUEUE_TYPE.ERROR)
        } else if (
          deletePayload.failedDetails.filter(
            p => Object.keys(PRECONDITION_SUBSTATUS).filter(key => p.subStatusCode === Number(key)).length === 0,
          ).length === 0
        ) {
          confirm('batchDeletePolicyConflictErrorConfirmationDialog')
        } else {
          confirm('batchDeletePolicyErrorConfirmationDialog')
        }
      }
      if (deletePayload.failedCount !== deletePayload.totalCount) {
        refetchProfiles()
      }
      dispatch(ResetPolicy())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletePayload, selectedItems])

  const onDeletePolicy = (rows: any[]) => {
    if (rows.length >= 1) {
      const deletePayload = rows.map(r => r.entityId)
      setProfilesToDelete(selectedItems.filter(p => deletePayload.includes(p.entityId)))
      dispatch(DeletePolicies(deletePayload))
    }
  }

  useEffect(() => {
    refetchProfiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { confirmationOptions, confirmDelete } = useDeleteProfilesConfirmation(unselectAll, onDeletePolicy)

  const toolbarProps = useProfilesListToolbar({
    selectedItems,
    onRank: canUpdate ? () => setRankMode(true) : undefined,
    items: tableProps?.data?.length ?? 0,
    onSearch: handleSearch,
    onAddPolicy: canCreate ? () => navigate('../../protectMobile/create') : undefined,
    onDeletePolicies: canDelete
      ? items => {
          confirmDelete(items)
        }
      : undefined,
  })

  const rankProps = useRankable({
    rankMode,
    setRankMode,
    resetDrag: resetDrag,
    data: tableProps?.data,
    updateRank,
    rankingSaved,
    setRankingSaved,
  })

  const UnsavedConfirmationDialog = useDialogPrompt('gateway/common:common.unsavedChangesMessage', !rankingSaved)

  //console.warn('MTD.Policies')
  return (
    <>
      {!rankMode && <Typography variant="body2">{t('mtd/common:policy.list.pageDescription')}</Typography>}
      {!rankMode && <TableToolbar {...toolbarProps} />}
      <DraggableTableProvider {...providerProps}>
        <DraggableTable {...tableProps} rankMode={rankMode} />
      </DraggableTableProvider>
      <FormButtonPanel {...rankProps} />
      <ConfirmationDialog {...confirmationOptions} />
      {UnsavedConfirmationDialog}
    </>
  )
})

PolicyList.displayName = 'MtdProfilesList'

export default PolicyList
