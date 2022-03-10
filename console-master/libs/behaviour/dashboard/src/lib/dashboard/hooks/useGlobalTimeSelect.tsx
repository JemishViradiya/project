/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateDashboardGlobalTimeMutation } from '@ues-data/dashboard'
import { useStatefulApolloMutation } from '@ues-data/shared'

import { selectGlobalTime, updateGlobalTime } from '../store'
import type { DashboardTime } from '../types'

type GlobalTimeSelectProps = {
  dashboardTime: DashboardTime
  setDashboardTime: (DashboardTime) => void
}

export const useGlobalTimeSelect = (): GlobalTimeSelectProps => {
  const dashboardTime = useSelector(selectGlobalTime)

  const [updateGlobalTimeFn] = useStatefulApolloMutation(updateDashboardGlobalTimeMutation, {
    onError: error => console.error(error.message),
    variables: { dashboardId: '' },
  })

  const dispatch = useDispatch()
  const setDashboardTime = useCallback(globalTime => dispatch(updateGlobalTime({ globalTime, updateFn: updateGlobalTimeFn })), [
    dispatch,
    updateGlobalTimeFn,
  ])

  return { dashboardTime, setDashboardTime }
}
