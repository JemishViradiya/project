/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { VariantType } from 'notistack'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, Dialog, makeStyles } from '@material-ui/core'

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
  InfiniteTable,
  InfiniteTableProvider,
  TableToolbar,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: '85vh',
  },
}))

const serviceId = ServiceId.EID
const entityType = ReconciliationEntityType.EID

const ProfileAssignments = React.memo((props: { profileId: string }) => {
  useSecuredContent(Permission.ECS_IDENTITY_READ)
  const { t } = useTranslation(['profiles'])
  const snackbar = useSnackbar()
  const classes = useStyles()

  const notify = (messageKey: string, type: VariantType) => {
    snackbar.enqueueMessage(t(messageKey), type)
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
  } = useBaseProfileAssignmentsData(serviceId, entityType, props.profileId, notify)

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

  const toolbarProps = useProfileAssignmentToolbar({
    selectedIds: providerProps?.selectedProps?.selected,
    items: assignedData?.profileMembers?.count?.total ?? 0,
    onAdd: () => setDialogId(Symbol('assignmentId')),
    onDelete: confirmDelete,
    loading: assignedDataLoading,
  })

  return (
    <>
      <Card className={classes.content} variant="outlined">
        <TableToolbar {...toolbarProps} />
        <InfiniteTableProvider {...providerProps}>
          <InfiniteTable {...tableProps} />
        </InfiniteTableProvider>
        <Dialog {...dialogOptions} />
      </Card>
      <ConfirmationDialog {...confirmationOptions} />
    </>
  )
})

export default ProfileAssignments
