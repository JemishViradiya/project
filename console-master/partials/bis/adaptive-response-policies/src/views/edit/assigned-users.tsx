import type { VariantType } from 'notistack'
import React, { memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { Box, Dialog } from '@material-ui/core'

import { useBaseProfileAssignmentsData } from '@ues-data/platform'
import { Permission, ReconciliationEntityType, ServiceId } from '@ues-data/shared'
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
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

interface PolicyAssignedUsers {
  readOnly: boolean
}

export const PolicyAssignedUsers = memo<PolicyAssignedUsers>(({ readOnly }) => {
  useSecuredContent(Permission.BIS_RISKPROFILE_READ)
  const { t: profilesT } = useTranslation(['profiles'])
  const { entityId } = useParams()
  const snackbar = useSnackbar()
  const notify = (messageKey: string, type: VariantType) => {
    snackbar.enqueueMessage(profilesT(messageKey), type)
  }

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
  } = useBaseProfileAssignmentsData(ServiceId.BIS, ReconciliationEntityType.BisPolicy, entityId, notify)

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
    submitAssignment: assign,
  })

  const onAdd = useCallback(() => setDialogId(Symbol('assignmentId')), [setDialogId])

  const toolbarProps = useProfileAssignmentToolbar({
    selectedIds: providerProps?.selectedProps?.selected,
    items: assignedData?.profileMembers?.count?.total ?? 0,
    onAdd,
    onDelete: confirmDelete,
    loading: assignedDataLoading,
  })

  return (
    <>
      <ContentAreaPanel boxProps={{ p: 6 }} fullWidth>
        <Box display="flex" flexDirection="column" height="72vh">
          {!readOnly && <TableToolbar {...toolbarProps} />}
          <InfiniteTableProvider {...providerProps}>
            <InfiniteTable {...tableProps} />
          </InfiniteTableProvider>
          <Dialog {...dialogOptions} />
        </Box>
      </ContentAreaPanel>
      <ConfirmationDialog {...confirmationOptions} />
    </>
  )
})
