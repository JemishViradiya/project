import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { BISEngineTrainingStatusQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

export const useTrainingStatus = () => {
  const { enqueueMessage } = useSnackbar()
  const { t } = useTranslation('bis/shared')

  const errorHandler = useCallback(() => {
    enqueueMessage(t('bis/shared:common.errorPleaseContact'), 'error')
  }, [enqueueMessage, t])

  return useStatefulApolloQuery(BISEngineTrainingStatusQuery, {
    onError: errorHandler,
  })
}
