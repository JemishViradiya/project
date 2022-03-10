import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useConfirmation } from '@ues/behaviours'

export const useResetModelsConfirmation = () => {
  const { t } = useTranslation(['persona/common'])
  const confirmation = useConfirmation()

  return useCallback(async () => {
    return await confirmation({
      title: t('dialogs.actionConfirmation'),
      description: t('users.actions.resetModelsDescription'),
      cancelButtonLabel: t('button.cancel'),
      confirmButtonLabel: t('personaModelButton.ResetScoring'),
    })
  }, [confirmation, t])
}
