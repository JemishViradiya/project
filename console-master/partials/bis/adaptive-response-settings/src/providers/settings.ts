import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { UESSettingsMutation, UESSettingsQuery } from '@ues-data/bis'
import { useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

const useSettings = () => {
  const { enqueueMessage } = useSnackbar()
  const { t } = useTranslation('bis/shared')

  const mutationErrorHandler = useCallback(() => {
    enqueueMessage(t('bis/shared:common.errorPleaseContact'), 'error')
  }, [enqueueMessage, t])

  const queryResult = useStatefulApolloQuery(UESSettingsQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    partialRefetch: true,
  })

  const [mutate, mutationValue] = useStatefulApolloMutation(UESSettingsMutation, {
    onError: mutationErrorHandler,
  })

  return [queryResult, mutate, mutationValue] as const
}

export default useSettings
