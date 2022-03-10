import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { UESActionTypesQuery } from '@ues-data/bis'
import { ActionType } from '@ues-data/bis/model'
import { useStatefulApolloQuery } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

import { TRANSLATION_NAMESPACES } from '../config'
import { isActionAvailable } from '../utils'

export const useAvailableActions = () => {
  const { enqueueMessage } = useSnackbar()
  const { t } = useTranslation(TRANSLATION_NAMESPACES)

  const { data: { availableActions = [] } = {}, loading, error } = useStatefulApolloQuery(UESActionTypesQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    partialRefetch: true,
  })

  const loaded = useMemo(() => !loading && !error, [error, loading])

  const networkAccessActionNotAvailable = useMemo(
    () => loaded && !isActionAvailable(availableActions, ActionType.OverrideNetworkAccessControlPolicy),
    [availableActions, loaded],
  )
  useEffect(() => {
    if (loaded && networkAccessActionNotAvailable) {
      enqueueMessage(t('actions.assignNetworkAccessPolicy.notAvailableError'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkAccessActionNotAvailable])

  return {
    availableActions,
    hasCommonUnavailableActions: networkAccessActionNotAvailable,
  } as const
}
