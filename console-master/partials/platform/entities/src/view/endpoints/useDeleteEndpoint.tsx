import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { EndpointsApi } from '@ues-data/platform'
import { usePrevious, useStatefulAsyncMutation } from '@ues-data/shared'
import type { SelectionModel } from '@ues/behaviours'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

export const useDeleteEndpoint = (count: number, selectionModel: SelectionModel, onSuccessDelete: () => void, query?: string) => {
  const { t } = useTranslation(['platform/endpoints', 'platform/common', 'general/form'])
  const confirmation = useConfirmation()
  const snackbar = useSnackbar()

  const [deleteAction, deleteState] = useStatefulAsyncMutation(EndpointsApi.deleteEndpoints, {
    variables: { selectionModel: undefined },
  })

  const deleteResponsePrev = usePrevious(deleteState)

  const handleConfirmDelete = useCallback(() => {
    deleteAction({ selectionModel: { ...selectionModel, query } })
  }, [deleteAction, selectionModel, query])

  const onDelete = useCallback(async () => {
    const result = await confirmation({
      title: t('endpoints.grid.actions.removeMultiple'),
      description: t('endpoints.grid.actions.removeEndpointsDescription', { count }),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('general/form:commonLabels.remove'),
    })
    if (result === ConfirmationState.Confirmed) {
      handleConfirmDelete()
    }
  }, [confirmation, handleConfirmDelete, t, count])

  useEffect(() => {
    if (deleteState.error) {
      snackbar.enqueueMessage(t('endpoints.grid.actions.remove.error'), 'error')
    } else if (!deleteState.loading && deleteResponsePrev.loading) {
      if (deleteState?.data?.deleteIsInProcess) {
        snackbar.enqueueMessage(t('platform/common:message.requestAccepted'), 'success')
        onSuccessDelete()
      } else if (deleteState?.data?.totalCount === count) {
        snackbar.enqueueMessage(t('endpoints.grid.actions.remove.success'), 'success')
        onSuccessDelete()
      } else {
        snackbar.enqueueMessage(
          t('endpoints.grid.actions.remove.errorWithCount', { count: deleteState?.data?.failedCount }),
          'error',
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteState])

  return { onDelete, deleteInProgress: deleteState?.loading }
}
