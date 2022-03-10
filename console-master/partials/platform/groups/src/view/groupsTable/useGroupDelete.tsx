import * as httpStatus from 'http-status-codes'
import { difference, isEqual } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { GroupsApi } from '@ues-data/platform'
import { usePrevious, useStatefulReduxMutation } from '@ues-data/shared'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

export const useGroupDelete = ({ selectedProps, refetch, groupsElements }) => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()
  const prevSelectForDelete = usePrevious(selectedProps?.selected ?? [])
  const [groupsForDelete, setGroupsForDelete] = useState([])

  const [deleteGroupsStartAction, deleteTask] = useStatefulReduxMutation(GroupsApi.mutationDeleteGroups)
  const prevDeleteTask = usePrevious(deleteTask)

  useEffect(() => {
    if (selectedProps?.selected && !isEqual(prevSelectForDelete, selectedProps?.selected)) {
      const added = difference(selectedProps?.selected, prevSelectForDelete)
      const removed = difference(prevSelectForDelete, selectedProps?.selected)
      let newSelection = groupsForDelete
      if (added.length > 0) {
        newSelection = [...groupsForDelete, ...groupsElements.filter(g => added.includes(g.id))]
      }
      if (removed.length > 0) {
        newSelection = groupsForDelete.filter(g => !removed.includes(g.id))
      }
      setGroupsForDelete(newSelection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProps?.selected])

  const handleDelete = useCallback(async () => {
    const confirmationState = await confirmation({
      title: t('groups.delete.title'),
      content: (
        <>
          <Typography variant="body2" gutterBottom>
            {t('groups.delete.messageMultiple')}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {t('groups.delete.note')}
          </Typography>
          {groupsForDelete.map(g => (
            <Typography variant="subtitle2" key={g['id']}>
              {g['name']}
            </Typography>
          ))}
        </>
      ),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('general/form:commonLabels.delete'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      deleteGroupsStartAction({ ids: selectedProps?.selected })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupsForDelete, selectedProps?.selected])

  useEffect(() => {
    if (GroupsApi.isTaskResolved(deleteTask, prevDeleteTask)) {
      if (deleteTask.error) {
        if (deleteTask.error['response'].status === httpStatus.NOT_FOUND) {
          snackbar.enqueueMessage(t('groups.delete.errorMessage404'), 'error')
        } else {
          snackbar.enqueueMessage(t('groups.delete.errorMessage'), 'error')
        }
      } else {
        snackbar.enqueueMessage(t('groups.delete.successMessage'), 'success')
      }
      selectedProps?.resetSelectedItems()
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteTask, prevDeleteTask])

  return {
    onDelete: handleDelete,
    deleteLoading: deleteTask.loading,
  }
}
