import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { mutationDeleteUsers } from '@ues-data/persona'
import { usePrevious, useStatefulReduxMutation } from '@ues-data/shared'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

interface UseDeleteUsersProps {
  selected: string[]
  refresh: () => void
}

export const useDeleteUsers = ({ selected, refresh }: UseDeleteUsersProps) => {
  const { t } = useTranslation(['persona/common'])
  const confirmation = useConfirmation()
  const [deleteUsersStartAction, deleteUsersTask] = useStatefulReduxMutation(mutationDeleteUsers)
  const deleteUsersTaskPrev = usePrevious(deleteUsersTask)
  const { enqueueMessage } = useSnackbar()

  const onDelete = useCallback(async () => {
    const confirmationState = await confirmation({
      title: t('dialogs.actionConfirmation'),
      description: t('users.actions.removeUserDescription', { count: selected.length }),
      cancelButtonLabel: t('button.cancel'),
      confirmButtonLabel: t('button.remove'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      deleteUsersStartAction(selected)
    }
  }, [confirmation, deleteUsersStartAction, selected, t])

  useEffect(() => {
    if (!deleteUsersTask.loading && deleteUsersTaskPrev.loading && deleteUsersTask.error) {
      enqueueMessage(t('users.notifications.removeUsersError'), 'error')
    } else if (!deleteUsersTask.loading && deleteUsersTaskPrev.loading) {
      enqueueMessage(t('users.notifications.removeUsersSuccess'), 'success')
      refresh()
    }
  }, [deleteUsersTask, deleteUsersTaskPrev.loading, enqueueMessage, selected.length, t, refresh])

  return onDelete
}
