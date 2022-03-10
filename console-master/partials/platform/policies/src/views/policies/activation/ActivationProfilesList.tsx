import type { VariantType } from 'notistack'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Typography } from '@material-ui/core'

import { useBaseProfilesData } from '@ues-data/platform'
import {
  Permission,
  ReconciliationEntityType,
  ServiceId,
  usePermissions,
  usePrevious,
  useStatefulReduxMutation,
} from '@ues-data/shared'
import { useDeleteProfilesConfirmation, useProfilesList, useProfilesListToolbar, useRankable } from '@ues-platform/policy-common'
import {
  ConfirmationDialog,
  DraggableTable,
  DraggableTableProvider,
  FormButtonPanel,
  TableToolbar,
  useConfirmation,
  useDialogPrompt,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import { getDeletePolicyTask, mutationDeleteMultiplePolicies, mutationDeletePolicy } from '../../../store/policies'
import { isTaskResolved } from '../../../store/policies/types'

const serviceId = ServiceId.ECM
const entityType = ReconciliationEntityType.ENROLLMENT

const ActivationProfilesList = React.memo(() => {
  useSecuredContent(Permission.ECS_ACTIVATIONPROFILE_READ)

  const { t } = useTranslation(['platform/common', 'general/form'])
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()
  const markedForDelete = useRef([])
  const { hasPermission } = usePermissions()
  const canUpdate = hasPermission(Permission.ECS_ACTIVATIONPROFILE_UPDATE)
  const canDelete = hasPermission(Permission.ECS_ACTIVATIONPROFILE_DELETE)
  const canCreate = hasPermission(Permission.ECS_ACTIVATIONPROFILE_CREATE)

  const [rankingSaved, setRankingSaved] = useState<boolean>(true)

  const notify = (message: string, type: VariantType) => {
    snackbar.enqueueMessage(message, type)
  }

  const { profilesData, profilesLoading, updateRank, refetchProfiles } = useBaseProfilesData(serviceId, entityType, notify, false)

  const deleteTask = useSelector(getDeletePolicyTask)
  const previousDeleteTask = usePrevious(deleteTask)

  const [deletePolicyStartAction] = useStatefulReduxMutation(mutationDeletePolicy)
  const [deleteMultiplePoliciesStartAction] = useStatefulReduxMutation(mutationDeleteMultiplePolicies)

  useEffect(() => {
    if (isTaskResolved(deleteTask, previousDeleteTask)) {
      if (deleteTask.error) {
        if (deleteTask.error['response']?.status === 412) {
          snackbar.enqueueMessage(t('activationProfile.list.singleDeleteFailure'), 'error')
        } else if (deleteTask.error['data']) {
          showDeleteFailureDialog(deleteTask.error['data'].failedDetails.map(d => d.entityId))
          refetchProfiles()
        } else {
          snackbar.enqueueMessage(t('activationProfile.list.deleteFailure'), 'error')
        }
      } else {
        snackbar.enqueueMessage(t('activationProfile.delete.successMessage'), 'success')
        refetchProfiles()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteTask, previousDeleteTask, refetchProfiles, t])

  const onDeletePolicy = (rows: any[]) => {
    markedForDelete.current = rows
    if (rows.length > 1) {
      deleteMultiplePoliciesStartAction({ entityIds: rows.map(r => r.entityId) })
    } else if (rows.length === 1) {
      deletePolicyStartAction({ entityId: rows[0].entityId })
    }
  }

  const showDeleteFailureDialog = async (ids: string[]) => {
    const failedProfiles = markedForDelete.current.filter(p => ids.includes(p.entityId))
    await confirmation({
      title: t('activationProfile.list.deleteFailure'),
      description: t('activationProfile.list.multipleDeleteFailure'),
      content: (
        <div>
          {failedProfiles.map(s => (
            <Typography variant="h4" key={s['entityId']}>
              {s['name']}
            </Typography>
          ))}
        </div>
      ),
      cancelButtonLabel: t('general/form:commonLabels.close'),
    })
  }

  useEffect(() => {
    refetchProfiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { unselectAll, tableProps, providerProps, rankMode, setRankMode, selectedItems, handleSearch, resetDrag } = useProfilesList(
    {
      rankable: true,
      getNamePath: policy => `../../activation/edit/${policy.entityId}`,
      getUsersPath: policy => `../../activation/edit/${policy.entityId}?tabId=1`,
      getGroupsPath: policy => `../../activation/edit/${policy.entityId}?tabId=1`,
      data: profilesData?.profiles?.elements ?? [],
      setRankingSaved,
      selectionEnabled: canDelete,
      loading: profilesLoading,
      tableName: entityType,
    },
  )
  const { confirmationOptions: deleteConfirmationOptions, confirmDelete } = useDeleteProfilesConfirmation(
    unselectAll,
    onDeletePolicy,
  )

  const toolbarProps = useProfilesListToolbar({
    selectedItems,
    onRank: canUpdate ? () => setRankMode(true) : undefined,
    items: tableProps?.data?.length ?? 0,
    onSearch: handleSearch,
    onAddPolicy: canCreate ? () => navigate('../../activation/add') : undefined,
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

  return (
    <>
      {!rankMode && <Typography variant="body2">{t('platform/common:activationProfile.list.pageDescription')}</Typography>}
      {!rankMode && <TableToolbar {...toolbarProps} />}
      <DraggableTableProvider {...providerProps}>
        <DraggableTable {...tableProps} rankMode={rankMode} />
      </DraggableTableProvider>
      <FormButtonPanel {...rankProps} />
      <ConfirmationDialog {...deleteConfirmationOptions} />
      {UnsavedConfirmationDialog}
    </>
  )
})

ActivationProfilesList.displayName = 'ActivationProfilesList'

export default ActivationProfilesList
