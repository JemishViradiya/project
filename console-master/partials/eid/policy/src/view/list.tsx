/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { VariantType } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { makeStyles, Typography } from '@material-ui/core'

import { mutateDeletePolicy } from '@ues-data/eid'
import { useBaseProfilesData } from '@ues-data/platform'
import { Permission, ReconciliationEntityType, ServiceId, usePermissions, useStatefulAsyncMutation } from '@ues-data/shared'
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

import { ENQUEUE_TYPE, QUERY_STRING_PARM, UPDATE_TABS } from './common/settings'

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(2),
  },
  list: {
    flexGrow: 1,
  },
}))

const serviceId = ServiceId.EID
const entityType = ReconciliationEntityType.EID

const PolicyList = React.memo(() => {
  useSecuredContent(Permission.ECS_IDENTITY_READ)
  const { hasPermission } = usePermissions()
  const canCreate = hasPermission(Permission.ECS_IDENTITY_CREATE)
  const canDelete = hasPermission(Permission.ECS_IDENTITY_DELETE)
  const canUpdate = hasPermission(Permission.ECS_IDENTITY_UPDATE)
  const { t } = useTranslation(['eid/common', 'profiles', 'gateway/common'])
  const navigate = useNavigate()
  const classes = useStyles()
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()
  const [rankingSaved, setRankingSaved] = useState<boolean>(true)

  // define mutation for policy delete
  const [deletePolicy, { data: dataDelete, loading: loadingDelete, error: errorDelete }] = useStatefulAsyncMutation(
    mutateDeletePolicy,
    {},
  )

  const [outstandingDeleteCnt, setOutstandingDeleteCnt] = React.useState<number>(null)
  const [totalDeleteCnt, setTotalDeleteCnt] = React.useState<number>(null)
  const [deleteRequests, setDeleteRequests] = React.useState<Map<string, string>>(null)

  const notify = (message: string, type: VariantType) => {
    snackbar.enqueueMessage(message, type)
  }

  const { profilesData, profilesLoading, updateRank, refetchProfiles } = useBaseProfilesData(serviceId, entityType, notify)

  const { unselectAll, tableProps, providerProps, rankMode, setRankMode, selectedItems, handleSearch, resetDrag } = useProfilesList(
    {
      rankable: true,
      getNamePath: policy => `../../enterpriseIdentity/update/${policy.entityId}`,
      getUsersPath: policy =>
        `../../enterpriseIdentity/update/${policy.entityId}?${QUERY_STRING_PARM.TAB}=${UPDATE_TABS.USERS_AND_GROUPS}`,
      getGroupsPath: policy =>
        `../../enterpriseIdentity/update/${policy.entityId}?${QUERY_STRING_PARM.TAB}=${UPDATE_TABS.USERS_AND_GROUPS}`,
      data: profilesData?.profiles?.elements ?? [],
      setRankingSaved,
      selectionEnabled: canDelete,
      loading: profilesLoading,
      tableName: entityType,
    },
  )

  const onDeletePolicy = (rows: any[]) => {
    if (rows.length >= 1) {
      // issue separate delete request for each selected policy
      setTotalDeleteCnt(rows.length)
      setOutstandingDeleteCnt(rows.length)
      const deleteRequestsTmp = new Map<string, string>()
      rows.forEach(r => {
        deleteRequestsTmp.set(r.entityId, r.name)
        deletePolicy({ id: r.entityId })
      })
      setDeleteRequests(deleteRequestsTmp)
    }
  }

  const confirm = async (operation: string) => {
    await confirmation({
      title: t(`eid/common:policy.${operation}.title`),
      description: t(`eid/common:policy.${operation}.description`),
      cancelButtonLabel: t(`eid/common:policy.${operation}.cancelButton`),
      content: (
        <div>
          {Array.from(deleteRequests.values()).map(s => (
            <Typography variant="h4" key={s}>
              {s}
            </Typography>
          ))}
        </div>
      ),
    })
  }

  useEffect(() => {
    if (outstandingDeleteCnt === 0) {
      if (deleteRequests.size === 0) {
        snackbar.enqueueMessage(t('eid/common:policy.list.deleteSuccess'), ENQUEUE_TYPE.SUCCESS)
      } else if (totalDeleteCnt === 1) {
        snackbar.enqueueMessage(t('eid/common:policy.serverError.delete'), ENQUEUE_TYPE.ERROR)
      } else {
        confirm('batchDeletePolicyErrorConfirmationDialog')
      }
    }
    refetchProfiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outstandingDeleteCnt])

  useEffect(() => {
    if (dataDelete && loadingDelete === false && !errorDelete) {
      setOutstandingDeleteCnt(outstandingDeleteCnt - 1)
      deleteRequests.delete(dataDelete['id'])
    } else if (loadingDelete === false && errorDelete) {
      setOutstandingDeleteCnt(outstandingDeleteCnt - 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDelete, loadingDelete, errorDelete])

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
    onAddPolicy: canCreate ? () => navigate('../../enterpriseIdentity/create') : undefined,
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

  //console.warn('EID.Policies')
  return (
    <>
      {!rankMode && <Typography variant="body2">{t('eid/common:policy.list.pageDescription')}</Typography>}
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

PolicyList.displayName = 'EidProfilesList'

export default PolicyList
