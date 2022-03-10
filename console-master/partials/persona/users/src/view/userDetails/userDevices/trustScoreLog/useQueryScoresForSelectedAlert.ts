import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AlertsApi, AlertsMockApi, usersActions, usersSelectors } from '@ues-data/persona'
import { useMock } from '@ues-data/shared'

export const useQueryScoresForSelectedAlert = (deviceId: string) => {
  const dispatch = useDispatch()
  const isMock = useMock()

  const { result, loading, error } = useSelector(usersSelectors.getScoresForSelectedAlertTask(deviceId))

  const getScoresForSelectedAlert = useCallback(
    (alertId: string) => {
      const api = isMock ? AlertsMockApi : AlertsApi

      dispatch(usersActions.getScoresForSelectedAlertStart({ alertId, deviceId }, api))
    },
    [deviceId, dispatch, isMock],
  )

  return useMemo(
    () => ({
      data: result,
      loading,
      error,
      getScoresForSelectedAlert,
    }),
    [error, loading, result, getScoresForSelectedAlert],
  )
}
