import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmationState, useConfirmation } from '@ues/behaviours'

export const useUnsavedChangesConfirmationDialog = <TCallback extends (...args: any[]) => void>(
  hasChanges: boolean,
  onConfirmation: TCallback,
  active = true,
) => {
  const confirmation = useConfirmation()
  const { t } = useTranslation('bis/ues')

  return useCallback(
    async (...args: Parameters<TCallback>) => {
      if (active && hasChanges) {
        const confirmationState = await confirmation({
          title: t('bis/ues:detectionPolicies.modifiedPolicyConfirmationDialog.title'),
          description: t('bis/ues:detectionPolicies.modifiedPolicyConfirmationDialog.description'),
          cancelButtonLabel: t('bis/ues:detectionPolicies.modifiedPolicyConfirmationDialog.cancelButton'),
          confirmButtonLabel: t('bis/ues:detectionPolicies.modifiedPolicyConfirmationDialog.confirmButton'),
        })

        if (confirmationState === ConfirmationState.Confirmed) {
          onConfirmation(...args)
        }
      } else {
        onConfirmation(...args)
      }
    },
    [active, hasChanges, onConfirmation, t, confirmation],
  )
}
