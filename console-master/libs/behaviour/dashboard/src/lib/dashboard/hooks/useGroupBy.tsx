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

import { selectCardState, updateCardState } from '../store'

type useCustomTimeProps = {
  id: string
  defaultGroupBy?: string
}

type CustomTimeSelectProps = {
  groupBy: string
  setGroupBy: (string) => void
}

const GROUP_BY_OPTION = 'groupBy'

export const useGroupBy = ({ id, defaultGroupBy }: useCustomTimeProps): CustomTimeSelectProps => {
  const cardState = useSelector(selectCardState)

  const [updateCardsFn] = useStatefulApolloMutation(updateDashboardCardStateMutation, {
    onError: error => console.error(error.message),
    variables: { dashboardId: '' },
  })

  let groupBy = defaultGroupBy

  const options = cardState[id].options
  if (typeof options !== 'undefined') {
    const groupByOption = options[GROUP_BY_OPTION]
    if (typeof groupByOption !== 'undefined') {
      groupBy = groupByOption as string
    }
  }

  const dispatch = useDispatch()
  const setGroupBy = useCallback(
    groupBySelection =>
      dispatch(
        updateCardState({
          cardInfo: { id, option: GROUP_BY_OPTION, value: groupBySelection },
          updateFn: updateCardsFn,
        }),
      ),
    [dispatch, id, updateCardsFn],
  )

  return { groupBy, setGroupBy }
}
