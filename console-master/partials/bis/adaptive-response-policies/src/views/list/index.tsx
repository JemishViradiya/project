/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { VariantType } from 'notistack'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

import { UESPolicyListDeleteMutation, useBISPolicySchema } from '@ues-data/bis'
import { useBaseProfilesData } from '@ues-data/platform'
import {
  FeatureName,
  Permission,
  ReconciliationEntityType,
  ServiceId,
  useFeatures,
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
  useDialogPrompt,
  useFeatureCheck,
  useSecuredContentWithService,
  useSnackbar,
} from '@ues/behaviours'

import { useStyles } from './styles'

const AdaptiveResponsePoliciesList = memo(() => {
  useSecuredContentWithService({ requiredPermissions: Permission.BIS_RISKPROFILE_READ, requiredServices: ServiceId.BIG })
  const { isMigratedToDP } = useBISPolicySchema()
  useFeatureCheck(() => !isMigratedToDP)
  const { hasPermission } = usePermissions()
  const canUpdate = hasPermission(Permission.BIS_RISKPROFILE_UPDATE)
  const canCreate = hasPermission(Permission.BIS_RISKPROFILE_CREATE)
  const canDelete = hasPermission(Permission.BIS_RISKPROFILE_DELETE)

  const { t } = useTranslation(['profiles', 'bis/ues'])
  const { t: gatewayT } = useTranslation(['gateway/common'])
  const classes = useStyles()
  const snackbar = useSnackbar()
  const [rankingSaved, setRankingSaved] = useState<boolean>(true)
  const features = useFeatures()
  const adaptiveSettingsPath = useMemo(() => {
    return features.isEnabled(FeatureName.UESCronosNavigation)
      ? '/uc/console#/settings/adaptive-security/general-settings'
      : '/uc/gateway-settings#/adaptiveresponse'
  }, [features])

  const notify = useCallback(
    (message: string, type: VariantType) => {
      snackbar.enqueueMessage(message, type)
    },
    [snackbar],
  )
  const navigate = useNavigate()

  const { profilesData, profilesLoading, updateRank, refetchProfiles } = useBaseProfilesData(
    ServiceId.BIS,
    ReconciliationEntityType.BisPolicy,
    notify,
  )

  const getNamePath = useCallback(policy => `../../adaptiveResponse/${policy.entityId}`, [])
  const getUsersAndGroupsPath = useCallback(policy => `../../adaptiveResponse/${policy.entityId}/applied`, [])

  const onAddPolicy = useCallback(() => navigate('../../adaptiveResponse/create'), [navigate])

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
      setRankingSaved,
      selectionEnabled: canDelete,
      loading: profilesLoading,
      tableName: ReconciliationEntityType.BisPolicy,
    },
  )

  const onDeleteCompleted = useCallback(() => {
    refetchProfiles()
    notify(t('profiles:policies.deletePoliciesSuccessMessage'), 'success')
  }, [notify, refetchProfiles, t])

  const onDeleteError = useCallback(
    deleteError => {
      refetchProfiles()
      notify(t('profiles:policies.deletePolicyErrorMessage'), 'error')
    },
    [notify, refetchProfiles, t],
  )

  const [deletePolicies] = useStatefulApolloMutation(UESPolicyListDeleteMutation, {
    onCompleted: onDeleteCompleted,
    onError: onDeleteError,
  })

  const onDelete = useCallback(async () => {
    if (selectedItems.length > 0) {
      await deletePolicies({ variables: { ids: selectedItems.map(item => item.entityId) } })
    }
  }, [deletePolicies, selectedItems])

  const { confirmationOptions, confirmDelete } = useDeleteProfilesConfirmation(unselectAll, onDelete)

  const toolbarProps = useProfilesListToolbar({
    selectedItems,
    onRank: canUpdate ? () => setRankMode(true) : undefined,
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
      {!rankMode && (
        <Typography variant="body2">
          {t('bis/ues:policies.list.info.paragraph')}
          <Link className={classes.infoLink} variant="body2" href={adaptiveSettingsPath}>
            {t('bis/ues:policies.list.info.link')}
          </Link>
        </Typography>
      )}
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

AdaptiveResponsePoliciesList.displayName = 'AdaptiveResponsePoliciesList'

export default AdaptiveResponsePoliciesList
