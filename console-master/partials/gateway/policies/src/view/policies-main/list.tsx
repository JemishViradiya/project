//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { VariantType } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Typography } from '@material-ui/core'

import { usePrevious } from '@ues-behaviour/react'
import { useBaseProfilesData } from '@ues-data/platform'
import type { ReconciliationEntity } from '@ues-data/shared'
import { ServiceId, useStatefulReduxMutation } from '@ues-data/shared'
import { Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'
import { useDeleteProfilesConfirmation, useProfilesList, useProfilesListToolbar, useRankable } from '@ues-platform/policy-common'
import {
  ConfirmationDialog,
  DraggableTable,
  DraggableTableProvider,
  FormButtonPanel,
  TableToolbar,
  useDialogPrompt,
  useSnackbar,
} from '@ues/behaviours'

import type { PolicyComponentInterface } from '../types'

const { GATEWAY_TRANSLATIONS_KEY, POLICY_LOCALIZATION_TITLE_KEY, POLICY_VIEWS_PERMISSIONS_MAP } = Config
const { mutationDeletePolicies, mutationDeletePolicy } = Data
const { useBigPermissions, useStatefulNotifications } = Hooks
const { Page } = Types
const { isTaskResolved, makePageRoute, isTaskRejected } = Utils

const PoliciesList: React.FC<PolicyComponentInterface> = ({ entityType }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { t: profilesT } = useTranslation(['profiles'])
  const navigate = useNavigate()
  const { enqueueMessage } = useSnackbar()
  const [rankingSaved, setRankingSaved] = useState<boolean>(true)

  const { canCreate, canUpdate, canDelete } = useBigPermissions(POLICY_VIEWS_PERMISSIONS_MAP[entityType], 'canRead')

  const [deletePolicyStartAction, deletePolicyTask] = useStatefulNotifications(useStatefulReduxMutation(mutationDeletePolicy), {
    success: t('policies.deletePolicySuccessMessage'),
    error: t('policies.deletePolicyErrorMessage'),
  })

  const previousDeletePolicyTask = usePrevious(deletePolicyTask)

  const [deletePoliciesStartAction, deletePoliciesTask] = useStatefulNotifications(
    useStatefulReduxMutation(mutationDeletePolicies),
    {
      success: t('policies.deletePoliciesSuccessMessage'),
      error: t('policies.deletePoliciesErrorMessage'),
    },
  )
  const previousDeletePoliciesTask = usePrevious(deletePoliciesTask)

  const { profilesData, profilesLoading, updateRank, refetchProfiles } = useBaseProfilesData(
    ServiceId.BIG,
    entityType,
    (message: string, type: VariantType) => enqueueMessage(message, type),
  )

  useEffect(() => {
    if (
      isTaskResolved(deletePolicyTask, previousDeletePolicyTask) ||
      isTaskResolved(deletePoliciesTask, previousDeletePoliciesTask) ||
      isTaskRejected(deletePoliciesTask, previousDeletePoliciesTask)
    ) {
      refetchProfiles()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletePolicyTask, deletePoliciesTask])

  useEffect(() => {
    refetchProfiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goToPolicyApplied = row =>
    makePageRoute(Page.GatewayPoliciesPolicyEditApplied, {
      params: { entityType, id: row.entityId },
    })

  const { unselectAll, tableProps, providerProps, rankMode, setRankMode, selectedItems, handleSearch, resetDrag } = useProfilesList(
    {
      rankable: true,
      getNamePath: row => makePageRoute(Page.GatewayPoliciesPolicyEdit, { params: { entityType, id: row.entityId } }),
      getUsersPath: row => goToPolicyApplied(row),
      getGroupsPath: row => goToPolicyApplied(row),
      data: profilesData?.profiles?.elements ?? [],
      setRankingSaved,
      selectionEnabled: canDelete,
      loading: profilesLoading,
      tableName: entityType,
    },
  )

  const handleDeletePolicy = (rows: ReconciliationEntity[]) => {
    if (rows.length > 1) {
      return deletePoliciesStartAction({ ids: rows.map(row => row.entityId), entityType })
    }

    return deletePolicyStartAction({ id: rows[0].entityId, entityType })
  }

  const { confirmationOptions, confirmDelete } = useDeleteProfilesConfirmation(unselectAll, handleDeletePolicy)

  const toolbarProps = useProfilesListToolbar({
    selectedItems,
    onRank: canUpdate ? () => setRankMode(true) : undefined,
    items: tableProps?.data?.length ?? 0,
    onSearch: handleSearch,
    onAddPolicy: canCreate ? () => navigate(makePageRoute(Page.GatewayPoliciesPolicyAdd, { params: { entityType } })) : undefined,
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
      {!rankMode && <Typography variant="body2">{t(`${POLICY_LOCALIZATION_TITLE_KEY[entityType]}PageDescription`)}</Typography>}
      {!rankMode && <TableToolbar {...toolbarProps} />}
      <DraggableTableProvider {...providerProps}>
        <DraggableTable {...tableProps} rankMode={rankMode} />
      </DraggableTableProvider>
      <FormButtonPanel {...rankProps} />
      <ConfirmationDialog {...confirmationOptions} />
      {UnsavedConfirmationDialog}
    </>
  )
}

export default PoliciesList
