import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { usePrevious } from '@ues-behaviour/react'
import { DataEntities } from '@ues-data/dlp'
import { useStatefulReduxMutation } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

type InputProps = {
  refetch: () => void
  refetchFavoriteList?: () => void
  unselectAll?: () => void
}

export const useAddToListDataType = ({ refetch: dataTypesRefetch, refetchFavoriteList, unselectAll }: InputProps) => {
  const { t } = useTranslation(['dlp/common'])
  const { enqueueMessage } = useSnackbar()

  const [addToAssociatedDataTypesAction, addToAssociatedDataTypesTask] = useStatefulReduxMutation(
    DataEntities.mutationAssotiateDataEntities,
  )

  // handler for "add to favorite list"
  const addToAssociatedDataTypesTaskPrev = usePrevious(addToAssociatedDataTypesTask)
  useEffect(() => {
    if (!addToAssociatedDataTypesTask.loading && addToAssociatedDataTypesTaskPrev.loading && addToAssociatedDataTypesTask.error) {
      enqueueMessage(t('setting.dataType.error.add', { error: addToAssociatedDataTypesTask.error.message }), 'error')
    } else if (!addToAssociatedDataTypesTask.loading && addToAssociatedDataTypesTaskPrev.loading) {
      enqueueMessage(t('setting.dataType.success.add'), 'success')
      dataTypesRefetch()
      refetchFavoriteList()
      unselectAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToAssociatedDataTypesTask])

  return { addToAssociatedDataTypesAction }
}
