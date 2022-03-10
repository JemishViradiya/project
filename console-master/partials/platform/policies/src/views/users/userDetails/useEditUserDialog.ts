import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { User } from '@ues-data/platform'
import { UsersApi } from '@ues-data/platform'
import { usePrevious, useStatefulAsyncMutation } from '@ues-data/shared'
import { useControlledDialog, useSnackbar } from '@ues/behaviours'

import { isCompleted, prepareUserData } from '../userUtils'

export const useEditUserDialog = refetch => {
  const snackbar = useSnackbar()
  const { t } = useTranslation(['platform/common'])

  const [editUserAction, editUserState] = useStatefulAsyncMutation(UsersApi.editUser, {})
  const prevEditState = usePrevious(editUserState)

  const [dialogStateId, setDialogStateId] = useState<symbol>()
  const { open, onClose } = useControlledDialog({
    dialogId: dialogStateId,
    onClose: useCallback(reason => {
      setDialogStateId(undefined)
    }, []),
  })

  const openEditDialog = useCallback(() => {
    setDialogStateId(Symbol('editUser'))
  }, [])

  const onSaveEdit = (userData: User) => {
    const user = prepareUserData(userData)

    editUserAction({ user })
  }

  useEffect(() => {
    if (isCompleted(editUserState, prevEditState)) {
      if (editUserState.error) {
        snackbar.enqueueMessage(t('users.details.edit.error'), 'error')
      } else {
        snackbar.enqueueMessage(t('users.details.edit.success'), 'success')
        onClose()
        refetch()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editUserState])

  return {
    openEditDialog,
    isEditOpen: open,
    onEditClose: onClose,
    onSaveEdit,
  }
}
