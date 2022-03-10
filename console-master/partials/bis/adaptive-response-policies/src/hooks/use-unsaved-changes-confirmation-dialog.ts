import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmationState, useConfirmation } from '@ues/behaviours'

import { TRANSLATION_NAMESPACES } from '../config'

export const useUnsavedChangesConfirmationDialog = <TCallback extends (...args: any[]) => void>(
  hasChanges: boolean,
  onConfirmation: TCallback,
  active = true,
) => {
  const confirmation = useConfirmation()
  const { t } = useTranslation(TRANSLATION_NAMESPACES)

  return useCallback(
    async (...args: Parameters<TCallback>) => {
      if (active && hasChanges) {
        const confirmationState = await confirmation({
          title: t('bis/ues:policies.modifiedPolicyConfirmationDialog.title'),
          description: t('bis/ues:policies.modifiedPolicyConfirmationDialog.description'),
          cancelButtonLabel: t('bis/ues:policies.modifiedPolicyConfirmationDialog.cancelButton'),
          confirmButtonLabel: t('bis/ues:policies.modifiedPolicyConfirmationDialog.confirmButton'),
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
