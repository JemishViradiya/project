import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { GroupsApi } from '@ues-data/platform'
import { usePrevious, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

import { useImmediateProfileAssignment } from './useImmediateProfileAssignment'

export const useUpdateGroup = id => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const snackbar = useSnackbar()
  const navigate = useNavigate()
  const confirmation = useConfirmation()
  const policiesProps = useImmediateProfileAssignment(id)

  const { data: group } = useStatefulReduxQuery(GroupsApi.queryGroup, { variables: id })

  const [updateGroupsAction, updateTask] = useStatefulReduxMutation(GroupsApi.mutationUpdateGroup)
  const prevUpdateTask = usePrevious(updateTask)

  useEffect(() => {
    if (GroupsApi.isTaskResolved(updateTask, prevUpdateTask)) {
      if (updateTask.error) {
        snackbar.enqueueMessage(t('groups.update.errorMessage'), 'error')
      } else {
        snackbar.enqueueMessage(t('groups.update.successMessage'), 'success')
        navigate(-1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTask, prevUpdateTask])

  const [deleteGroupsStartAction, deleteTask] = useStatefulReduxMutation(GroupsApi.mutationDeleteGroups)
  const prevDeleteTask = usePrevious(deleteTask)

  const handleDeleteGroup = useCallback(async () => {
    const confirmationState = await confirmation({
      title: t('groups.delete.titleSingle'),
      description: t('groups.delete.messageSingle', { name: group?.name }),
      content: t('groups.delete.note'),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('general/form:commonLabels.delete'),
      maxWidth: 'xs',
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      deleteGroupsStartAction({ ids: [id] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, group])

  useEffect(() => {
    if (GroupsApi.isTaskResolved(deleteTask, prevDeleteTask)) {
      if (deleteTask.error) {
        snackbar.enqueueMessage(deleteTask.error.message, 'error')
      } else {
        snackbar.enqueueMessage(t('groups.delete.successMessage'), 'success')
        navigate(-1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteTask, prevDeleteTask])

  return {
    group,
    policiesProps,
    updateGroupsAction,
    onDeleteGroup: handleDeleteGroup,
    showLoading: updateTask?.loading || deleteTask?.loading,
  }
}
