import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePrevious } from '@ues-behaviour/react'
import { DataEntities } from '@ues-data/dlp'
import { useStatefulReduxMutation } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

type InputProps = {
  refetch: () => void
  unselectAll?: () => void
}

export const useDeleteDataType = ({ refetch: dataTypesRefetch, unselectAll }: InputProps) => {
  const { t } = useTranslation(['dlp/common'])
  const { enqueueMessage } = useSnackbar()

  const [deleteFromAssociatedDataTypesAtion, deleteFromAssociatedDataTypesTask] = useStatefulReduxMutation(
    DataEntities.mutationDeleteDataEntity,
  )

  // handler for "deletion"
  const deleteFromAssociatedDataTypesTaskPrev = usePrevious(deleteFromAssociatedDataTypesTask)
  useEffect(() => {
    if (
      !deleteFromAssociatedDataTypesTask.loading &&
      deleteFromAssociatedDataTypesTaskPrev.loading &&
      deleteFromAssociatedDataTypesTask.error
    ) {
      enqueueMessage(t('setting.dataType.error.remove', { error: deleteFromAssociatedDataTypesTask.error.message }), 'error')
    } else if (!deleteFromAssociatedDataTypesTask.loading && deleteFromAssociatedDataTypesTaskPrev.loading) {
      enqueueMessage(t('setting.dataType.success.remove'), 'success')
      dataTypesRefetch()
      unselectAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFromAssociatedDataTypesTask])

  return { deleteFromAssociatedDataTypesAtion }
}
