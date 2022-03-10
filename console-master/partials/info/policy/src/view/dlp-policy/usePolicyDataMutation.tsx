import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePrevious } from '@ues-behaviour/react'
import { PolicyData } from '@ues-data/dlp'
import { useStatefulReduxMutation } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

type InputProps = {
  refetch: () => void
  unselectAll: () => void
}

export const usePolicyDataMutation = ({ refetch: policyViewRefetch, unselectAll }: InputProps) => {
  const { t } = useTranslation(['dlp/policy'])
  const { enqueueMessage } = useSnackbar()

  const [deletePolicyStartAction, deletePolicyTask] = useStatefulReduxMutation(PolicyData.mutationDeletePolicy)

  // handler for "deletion"
  const deletePolicyTaskPrev = usePrevious(deletePolicyTask)
  useEffect(() => {
    if (!deletePolicyTask.loading && deletePolicyTaskPrev.loading && deletePolicyTask.error) {
      enqueueMessage(t('policy.error.delete'), 'error')
    } else if (!deletePolicyTask.loading && deletePolicyTaskPrev.loading) {
      enqueueMessage(t('policy.success.delete'), 'success')
      policyViewRefetch()
      //policyViewProps?.selectedProps.resetSelectedItems()
      unselectAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletePolicyTask])

  return { deletePolicyStartAction }
}
