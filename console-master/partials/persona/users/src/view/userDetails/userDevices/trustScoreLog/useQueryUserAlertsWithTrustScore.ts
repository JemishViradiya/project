import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { GetAlertsWithTrustScoreParams, PersonaScoreChartInterval } from '@ues-data/persona'
import { AlertsApi, AlertsMockApi, usersActions, usersSelectors } from '@ues-data/persona'
import { useMock } from '@ues-data/shared'

export const useQueryUserAlertWithTrustScore = (deviceId: string) => {
  const dispatch = useDispatch()
  const isMock = useMock()

  const { result, loading, error } = useSelector(usersSelectors.getUserAlertsWithTrustScoreTask(deviceId))

  const getUserAlertsWithTrustScore = useCallback(
    (params: GetAlertsWithTrustScoreParams, interval: PersonaScoreChartInterval) => {
      const api = isMock ? AlertsMockApi : AlertsApi

      dispatch(usersActions.getUserAlertsWithTrustScoreStart({ params, interval }, api))
    },
    [dispatch, isMock],
  )

  return useMemo(
    () => ({
      data: result,
      loading,
      error,
      getUserAlertsWithTrustScore,
    }),
    [error, loading, result, getUserAlertsWithTrustScore],
  )
}
