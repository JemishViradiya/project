/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Group } from '@ues-data/platform'
import { UsersApi } from '@ues-data/platform'
import { usePrevious, useStatefulAsyncMutation, useStatefulAsyncQuery } from '@ues-data/shared'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

import { isCompleted } from '../../../userUtils'

const renderGroupListItem = item => {
  return item.name
}

export const useGroupAssignDialog = (userId, userGroups, refetch) => {
  const { t } = useTranslation(['platform/common', 'general/form'])
  const { enqueueMessage } = useSnackbar()
  const [search, setSearch] = useState('')
  const [groupsAddDialogOpen, setGroupsAddDialogOpen] = useState(false)
  const singleGroupIsAssigned = useRef(true)

  const nonUserGroupsVars = useMemo(() => ({ userId, search, assigned: userGroups ?? [] }), [userId, search, userGroups])
  const availableGroupsState = useStatefulAsyncQuery(UsersApi.queryNonUserGroups, {
    variables: nonUserGroupsVars,
    skip: !groupsAddDialogOpen,
  })

  const [addUserToGroupsAction, addUserToGroupsState] = useStatefulAsyncMutation(UsersApi.addUserToGroups, {})
  const prevAddUserToGroupsState = usePrevious(addUserToGroupsState)

  const { data: availableGroups, error: errorAvailableGroupLoading } = availableGroupsState
  const prevAvailableGroups = usePrevious(availableGroupsState)

  useEffect(() => {
    if (isCompleted(availableGroupsState, prevAvailableGroups) && errorAvailableGroupLoading) {
      enqueueMessage(t('users.details.configuration.groups.errors.search'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorAvailableGroupLoading])

  useEffect(() => {
    if (isCompleted(addUserToGroupsState, prevAddUserToGroupsState)) {
      if (addUserToGroupsState.error) {
        enqueueMessage(t('users.details.configuration.groups.error.assign'), 'error')
      } else {
        const message = singleGroupIsAssigned.current
          ? t('users.details.configuration.groups.success.assign.single')
          : t('users.details.configuration.groups.success.assign.multiple')

        enqueueMessage(message, 'success')
        refetch()
        closeGroupHandler()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addUserToGroupsState])

  const groupLabels = useMemo(
    () => ({
      title: t('users.details.configuration.groups.dialogs.assign.title'),
      description: t('users.details.configuration.groups.dialogs.assign.description'),
      searchText: t('users.details.configuration.groups.dialogs.assign.searchText'),
      cancel: t('general/form:commonLabels.cancel'),
      submit: t('general/form:commonLabels.assign'),
    }),
    [t],
  )

  const handleGroupSearchChange = useCallback(async str => {
    setSearch(str)
  }, [])

  const openAddDialog = useCallback(() => {
    handleGroupSearchChange('')
    setGroupsAddDialogOpen(true)
  }, [handleGroupSearchChange])

  const closeGroupHandler = useCallback(() => {
    setGroupsAddDialogOpen(false)
  }, [])

  const submitGroupHandler = useCallback(
    groups => {
      singleGroupIsAssigned.current = groups.length === 1
      addUserToGroupsAction({ userId, groups })
    },
    [addUserToGroupsAction, userId],
  )

  return {
    dialogProps: {
      open: groupsAddDialogOpen,
      setOpen: setGroupsAddDialogOpen,
      labels: groupLabels,
      values: availableGroups ?? [],
      renderListItem: renderGroupListItem,
      handleSearchChange: handleGroupSearchChange,
      closeHandler: closeGroupHandler,
      submitHandler: submitGroupHandler,
    },
    openAddDialog,
  }
}

export const useGroupUnassign = (userId, userDisplayName, refetch) => {
  const { enqueueMessage } = useSnackbar()
  const confirmation = useConfirmation()
  const { t } = useTranslation(['platform/common', 'general/form'])

  const [removeFromGroupAction, removeFromGroupState] = useStatefulAsyncMutation(UsersApi.removeUserFromGroup, {})
  const prevRemoveFromGroupState = usePrevious(removeFromGroupState)

  const handleDelete = useCallback(
    async (group: Group) => {
      const confirmationState = await confirmation({
        title: t('users.details.configuration.groups.dialogs.unassign.title'),
        description: t('users.details.configuration.groups.dialogs.unassign.description', {
          displayName: userDisplayName,
          groupName: group.name,
        }),
        cancelButtonLabel: t('general/form:commonLabels.cancel'),
        confirmButtonLabel: t('general/form:commonLabels.unassign'),
        maxWidth: 'xs',
      })

      if (confirmationState === ConfirmationState.Confirmed) {
        removeFromGroupAction({ userId, groupId: group.id })
      }
    },
    [removeFromGroupAction, userDisplayName, t, confirmation, userId],
  )

  useEffect(() => {
    if (isCompleted(removeFromGroupState, prevRemoveFromGroupState)) {
      if (removeFromGroupState.error) {
        enqueueMessage(t('users.details.configuration.groups.errors.unassign'), 'error')
      } else {
        enqueueMessage(t('users.details.configuration.groups.success.unassign'), 'success')
        refetch()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeFromGroupState])

  return {
    handleDelete,
  }
}

export const usePolicySync = refetchPoliciesRef => {
  const timerId = useRef(undefined)

  const syncPolicies = useCallback(async () => {
    timerId.current && clearTimeout(timerId.current)
    if (typeof refetchPoliciesRef.current === 'function') {
      await new Promise(resolve => {
        timerId.current = setTimeout(() => resolve(refetchPoliciesRef.current()), 2000)
      })
      await new Promise(resolve => {
        timerId.current = setTimeout(() => resolve(refetchPoliciesRef.current()), 4000)
      })
    }
  }, [refetchPoliciesRef])

  const cancelSync = useCallback(() => {
    timerId.current && clearTimeout(timerId.current)
  }, [])

  // Remove when push updates from reco service are implemented
  return { syncPolicies, cancelSync }
}
