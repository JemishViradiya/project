//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { VariantType } from 'notistack'
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

import { Box, Dialog } from '@material-ui/core'

import { PolicyData } from '@ues-data/dlp'
import { useBaseProfileAssignmentsData } from '@ues-data/platform'
import { ServiceId } from '@ues-data/shared'
import {
  useProfileAssignments,
  useProfileAssignmentToolbar,
  useUnassignMembersConfirmation,
  useUserGroupAssignmentDialog,
} from '@ues-platform/policy-common'
import {
  ConfirmationDialog,
  ContentAreaPanel,
  InfiniteTable,
  InfiniteTableProvider,
  TableToolbar,
  useSnackbar,
} from '@ues/behaviours'

import PolicyEditor from '../policy-editor/index'
import { usePoliciesPermissions } from '../usePoliciesPermission'

const PolicyAssignedUsers: React.FC = () => {
  const { t: profilesT } = useTranslation(['profiles'])
  const { guid, policyType } = useParams()
  const snackbar = useSnackbar()
  const notify = (messageKey: string, type: VariantType) => {
    snackbar.enqueueMessage(profilesT(messageKey), type)
  }
  const { canUpdate } = usePoliciesPermissions()
  const hasUnsavedChanges = useSelector(PolicyData.getHasUnsavedPolicyChanges(false))

  const {
    assignableData,
    refetchAssignable,
    assignableDataLoading,
    assignedData,
    assignedDataLoading,
    refetchAssigned,
    fetchMore,
    assign,
    unassign,
    setSearchTerm,
    setSortDirection,
  } = useBaseProfileAssignmentsData(ServiceId.DLP, policyType.toUpperCase(), guid, notify)

  useEffect(() => {
    refetchAssigned()
    refetchAssignable()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { tableProps, providerProps } = useProfileAssignments({
    data: assignedData?.profileMembers,
    fetchMore,
  })

  useEffect(() => {
    setSortDirection(providerProps?.sortingProps?.sortDirection.toUpperCase())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerProps?.sortingProps?.sortDirection])

  const { confirmationOptions, confirmDelete } = useUnassignMembersConfirmation(
    providerProps?.selectedProps,
    assignedData?.profileMembers?.elements ?? [],
    unassign,
  )

  const { dialogOptions, setDialogId } = useUserGroupAssignmentDialog({
    data: assignableData?.profileNonMembers?.elements ?? [],
    loading: assignableDataLoading,
    handleSearch: setSearchTerm,
    submitAssignment: userAndGroup4Assignment => {
      assign(userAndGroup4Assignment)
    },
  })

  const toolbarProps = useProfileAssignmentToolbar({
    selectedIds: providerProps?.selectedProps?.selected,
    items: assignedData?.profileMembers?.count?.total ?? 0,
    onAdd: () => setDialogId(Symbol('assignmentId')),
    onDelete: confirmDelete,
    loading: assignedDataLoading,
  })

  providerProps.selectedProps = canUpdate ? providerProps.selectedProps : null

  return (
    <>
      <ContentAreaPanel boxProps={{ p: 6 }} fullWidth>
        <Box display="flex" flexDirection="column" height="72vh">
          {canUpdate && <TableToolbar {...toolbarProps} />}
          <InfiniteTableProvider {...providerProps}>
            <InfiniteTable {...tableProps} />
          </InfiniteTableProvider>
          <Dialog {...dialogOptions} />
        </Box>
      </ContentAreaPanel>
      <ConfirmationDialog {...confirmationOptions} />
      {hasUnsavedChanges && <PolicyEditor />}
    </>
  )
}

export default memo(PolicyAssignedUsers)
