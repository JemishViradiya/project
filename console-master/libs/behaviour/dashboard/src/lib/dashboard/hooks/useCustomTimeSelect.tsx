/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateDashboardCardStateMutation } from '@ues-data/dashboard'
import { useStatefulApolloMutation } from '@ues-data/shared'

import { selectCardState, selectNowTime, updateCardState } from '../store'
import type { DashboardTime } from '../types'
import { TimeIntervalId } from '../types'

type useCustomTimeProps = {
  id: string
  defaultTimeInterval?: TimeIntervalId
}

type CustomTimeSelectProps = {
  showCustomTime: boolean
  customDashboardTime: DashboardTime
  setCustomDashboardTime: (DashboardTime) => void
}

const CUSTOM_TIME_MENU_OPTION = 'customTime'

export const useCustomTimeSelect = ({ id, defaultTimeInterval }: useCustomTimeProps): CustomTimeSelectProps => {
  const cardState = useSelector(selectCardState)
  const nowTime = useSelector(selectNowTime)

  const [updateCardsFn] = useStatefulApolloMutation(updateDashboardCardStateMutation, {
    onError: error => console.error(error.message),
    variables: { dashboardId: '' },
  })

  let showCustomTime = false
  let customDashboardTime = { timeInterval: defaultTimeInterval, nowTime }

  const options = cardState[id].options
  if (typeof options !== 'undefined') {
    const customTime = options[CUSTOM_TIME_MENU_OPTION]
    if (typeof customTime !== 'undefined') {
      if (Object.values<string>(TimeIntervalId).includes(customTime as string)) {
        customDashboardTime = { timeInterval: customTime, nowTime } as DashboardTime
        showCustomTime = true
      } else if (typeof customTime === 'boolean') {
        showCustomTime = customTime
      }
    }
  }

  const dispatch = useDispatch()
  const setCustomDashboardTime = useCallback(
    time =>
      dispatch(
        updateCardState({
          cardInfo: { id, option: CUSTOM_TIME_MENU_OPTION, value: time.timeInterval },
          updateFn: updateCardsFn,
        }),
      ),
    [dispatch, id, updateCardsFn],
  )

  return { showCustomTime, customDashboardTime, setCustomDashboardTime }
}
