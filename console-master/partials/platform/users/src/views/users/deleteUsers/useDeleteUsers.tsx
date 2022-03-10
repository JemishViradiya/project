/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import type { ServerSideSelectionModel } from '@ues-data/platform'
import { UsersApi } from '@ues-data/platform'
import { usePrevious, useStatefulAsyncMutation } from '@ues-data/shared'
import type { UseSelected } from '@ues/behaviours'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

import { isCompleted } from '../userUtils'

export const useDeleteUsers = (
  selectedProps: UseSelected<any>,
  selectedCount: number,
  serverSideSelectionModel: ServerSideSelectionModel,
  refetch: () => void,
) => {
  const { t } = useTranslation(['platform/common', 'general/form'])
  const confirmation = useConfirmation()
  const snackbar = useSnackbar()

  const [deleteUsersFn, deleteUsersResponse] = useStatefulAsyncMutation(UsersApi.deleteUsers, {})
  const deleteResponsePrev = usePrevious(deleteUsersResponse)

  const deleteUsers = useCallback(() => {
    deleteUsersFn({
      selectionModel: { ...serverSideSelectionModel },
    })
  }, [deleteUsersFn, serverSideSelectionModel])

  const handleDelete = useCallback(async () => {
    const confirmationState = await confirmation({
      title: t('users.actions.delete'),
      description: t('users.actions.deleteUserDescription', {
        userCount: selectedCount,
      }),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('general/form:commonLabels.delete'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      deleteUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProps?.selected])

  const showSuccessMessage = useCallback(() => {
    const successMessage =
      selectedProps?.selected?.length > 1 ? t('users.message.success.deletePlural') : t('users.message.success.delete')
    selectedProps.resetSelectedItems()
    snackbar.enqueueMessage(successMessage, 'success')
  }, [selectedProps, snackbar, t])

  const showDeleteInProcessMessage = useCallback(() => {
    selectedProps.resetSelectedItems()
    snackbar.enqueueMessage(t('message.requestAccepted'), 'success')
  }, [selectedProps, snackbar, t])

  useEffect(() => {
    if (isCompleted(deleteUsersResponse, deleteResponsePrev)) {
      if (deleteUsersResponse.error || deleteUsersResponse.data?.failed?.length > 0) {
        snackbar.enqueueMessage(t('users.message.error.delete'), 'error')
      } else if (deleteUsersResponse.data?.deleteIsInProcess) {
        showDeleteInProcessMessage()
      } else {
        showSuccessMessage()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteUsersResponse])

  return {
    handleDelete,
    deleteLoading: deleteUsersResponse?.loading,
  }
}
