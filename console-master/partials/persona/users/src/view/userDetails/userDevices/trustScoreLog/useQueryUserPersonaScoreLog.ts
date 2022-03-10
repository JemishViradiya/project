import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AlertsApi, AlertsMockApi, usersActions, usersSelectors } from '@ues-data/persona'
import { useMock } from '@ues-data/shared'

export const useQueryUserPersonaScoreLog = (deviceId: string) => {
  const dispatch = useDispatch()
  const isMock = useMock()

  const { result, loading, error } = useSelector(usersSelectors.getUserPersonaScoreLogTask(deviceId))

  const getUserPersonaScoreLog = useCallback(
    (payload: Parameters<typeof usersActions.getUserPersonaScoreLogStart>[1]) => {
      const api = isMock ? AlertsMockApi : AlertsApi

      dispatch(usersActions.getUserPersonaScoreLogStart(deviceId, payload, api))
    },
    [dispatch, deviceId, isMock],
  )

  return useMemo(
    () => ({
      data: result,
      loading,
      error,
      getUserPersonaScoreLog,
    }),
    [error, loading, result, getUserPersonaScoreLog],
  )
}
