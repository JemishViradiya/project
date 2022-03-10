/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { VariantType } from 'notistack'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'

import { DeleteDetectionPoliciesMutation, useBISPolicySchema } from '@ues-data/bis'
import { useBaseProfilesData } from '@ues-data/platform'
import {
  FeatureName,
  Permission,
  ReconciliationEntityType,
  ServiceId,
  usePermissions,
  useStatefulApolloMutation,
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
  useFeatureCheck,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import { ROUTE_PATH } from '../../config/route'
import { useStyles } from './styles'

const RiskDetectionPoliciesList = memo(() => {
  useSecuredContent(Permission.BIS_RISKPROFILE_READ)
  const { isMigratedToDP } = useBISPolicySchema()
  useFeatureCheck(isEnabled => isEnabled(FeatureName.UESActionOrchestrator) && isMigratedToDP)
  const { t } = useTranslation(['profiles', 'bis/ues'])
  const { t: gatewayT } = useTranslation(['gateway/common'])
  const classes = useStyles()
  const snackbar = useSnackbar()
  const [rankingSaved, setRankingSaved] = useState<boolean>(true)

  const { hasPermission } = usePermissions()
  const canUpdate = hasPermission(Permission.BIS_RISKPROFILE_UPDATE)
  const canCreate = hasPermission(Permission.BIS_RISKPROFILE_CREATE)
  const canDelete = hasPermission(Permission.BIS_RISKPROFILE_DELETE)

  const notify = useCallback(
    (message: string, type: VariantType) => {
      snackbar.enqueueMessage(message, type)
    },
    [snackbar],
  )
  const navigate = useNavigate()

  const { profilesData, profilesLoading, updateRank, refetchProfiles } = useBaseProfilesData(
    ServiceId.BIS,
    ReconciliationEntityType.BISDetectionPolicy,
    notify,
  )

  const getNamePath = useCallback(policy => `../..${ROUTE_PATH}/${policy.entityId}`, [])
  const getUsersAndGroupsPath = useCallback(policy => `../..${ROUTE_PATH}/${policy.entityId}/applied`, [])

  const onAddPolicy = useCallback(() => navigate(`../..${ROUTE_PATH}/create`), [navigate])

  useEffect(() => {
    refetchProfiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { unselectAll, tableProps, providerProps, rankMode, setRankMode, selectedItems, handleSearch, resetDrag } = useProfilesList(
    {
      rankable: true,
      getNamePath,
      getUsersPath: getUsersAndGroupsPath,
      getGroupsPath: getUsersAndGroupsPath,
      data: profilesData?.profiles?.elements ?? [],
      selectionEnabled: canDelete,
      setRankingSaved,
      loading: profilesLoading,
      tableName: ReconciliationEntityType.BISDetectionPolicy,
    },
  )

  const markedForDelete = useRef([])

  const confirmation = useConfirmation()

  const showDeleteFailureDialog = useCallback(
    async items => {
      await confirmation({
        title: t('profiles:policies.deletePoliciesErrorMessage'),
        description: t('profiles:policies.deleteMultiplePoliciesErrorDescription'),
        content: (
          <div>
            {items.map(s => (
              <Typography variant="h4" key={s['entityId']}>
                {s['name']}
              </Typography>
            ))}
          </div>
        ),
        cancelButtonLabel: t('general/form:commonLabels.close'),
      })
    },
    [t, confirmation],
  )

  const onDeleteCompleted = useCallback(() => {
    refetchProfiles()
    notify(t('profiles:policies.deletePoliciesSuccessMessage'), 'success')
  }, [notify, refetchProfiles, t])

  const onDeleteError = useCallback(
    deleteError => {
      refetchProfiles()
      const failedItems = markedForDelete.current.filter(item => {
        return item.groupCount > 0 || item.userCount > 0
      })
      if (markedForDelete.current.length > 1 && failedItems.length > 0) {
        showDeleteFailureDialog(failedItems)
      } else {
        notify(t('profiles:policies.deletePolicyErrorMessage'), 'error')
      }
    },
    [refetchProfiles, notify, t, showDeleteFailureDialog, markedForDelete],
  )

  const [deletePolicies] = useStatefulApolloMutation(DeleteDetectionPoliciesMutation, {
    onCompleted: onDeleteCompleted,
    onError: onDeleteError,
  })

  const onDelete = useCallback(async () => {
    if (selectedItems.length > 0) {
      markedForDelete.current = [...selectedItems]
      await deletePolicies({ variables: { ids: selectedItems.map(item => item.entityId) } })
    }
  }, [deletePolicies, selectedItems])

  const { confirmationOptions, confirmDelete } = useDeleteProfilesConfirmation(unselectAll, onDelete)

  const onRank = useCallback(() => setRankMode(true), [setRankMode])

  const toolbarProps = useProfilesListToolbar({
    selectedItems,
    onRank: canUpdate ? onRank : undefined,
    items: tableProps?.data?.length ?? 0,
    onSearch: handleSearch,
    onAddPolicy: canCreate ? onAddPolicy : undefined,
    onDeletePolicies: canDelete ? confirmDelete : undefined,
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
      {!rankMode && <Typography variant="body2">{t('bis/ues:detectionPolicies.list.info.paragraph')}</Typography>}
      <div className={classes.container}>
        {!rankMode && <TableToolbar {...toolbarProps} />}
        <DraggableTableProvider {...providerProps}>
          <DraggableTable {...tableProps} rankMode={rankMode} />
        </DraggableTableProvider>
        <FormButtonPanel {...rankProps} />
        <ConfirmationDialog {...confirmationOptions} />
        {UnsavedConfirmationDialog}
      </div>
    </>
  )
})

RiskDetectionPoliciesList.displayName = 'RiskDetectionPoliciesList'

export default RiskDetectionPoliciesList
