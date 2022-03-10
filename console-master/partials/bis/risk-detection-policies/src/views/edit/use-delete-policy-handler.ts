import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { DeleteDetectionPoliciesMutation } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

import { useGoToPoliciesListCallback } from '../../hooks/use-go-to-policies-list-callback'

export const useDeletePolicyHandler = () => {
  const { enqueueMessage } = useSnackbar()
  const { t } = useTranslation(['bis/ues', 'bis/shared', 'profiles'])
  const goToPoliciesList = useGoToPoliciesListCallback()
  const confirmation = useConfirmation()

  const onCompleted = useCallback(() => {
    enqueueMessage(t('bis/ues:detectionPolicies.snackbars.successfulDeletion'), 'success')
    goToPoliciesList()
  }, [t, enqueueMessage, goToPoliciesList])

  const onError = useCallback(
    error => {
      enqueueMessage(t('profiles:policies.deletePolicyErrorMessage'), 'error')
    },
    [t, enqueueMessage],
  )

  const [deletePolicies, { loading: pending }] = useStatefulApolloMutation(DeleteDetectionPoliciesMutation, {
    onCompleted,
    onError,
  })

  const deletePolicyHandler = useCallback(
    async (policyId: string, policyName?: string) => {
      const confirmationState = await confirmation({
        title: t('bis/ues:detectionPolicies.delete.deleteConfirmation'),
        description: t('bis/ues:detectionPolicies.delete.deleteSingle', {
          name: policyName,
        }),
        content: t('bis/ues:detectionPolicies.delete.deleteNote'),
        cancelButtonLabel: t('bis/shared:common.cancel'),
        confirmButtonLabel: t('bis/shared:common.delete'),
      })

      if (confirmationState === ConfirmationState.Confirmed) {
        deletePolicies({ variables: { ids: [policyId] } })
      }
    },
    [deletePolicies, confirmation, t],
  )

  return { deletePolicyHandler, pending }
}
