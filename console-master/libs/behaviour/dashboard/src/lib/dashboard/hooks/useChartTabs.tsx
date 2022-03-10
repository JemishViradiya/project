/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { SyntheticEvent } from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateDashboardCardStateMutation } from '@ues-data/dashboard'
import { useStatefulApolloMutation } from '@ues-data/shared'

import { selectCardState, updateCardState } from '../store'

type useChartTabsProps = {
  id: string
  defaultIndex?: number
}

type ChartTabsProps = {
  currentTabIndex: number
  handleTabChange: (event: SyntheticEvent<Element, Event>) => void
}

const CHART_TAB_OPTION = 'chartTab'

export const useChartTabs = ({ id, defaultIndex }: useChartTabsProps): ChartTabsProps => {
  let currentTabIndex = typeof defaultIndex === 'undefined' ? 0 : defaultIndex
  const cardState = useSelector(selectCardState)
  const dispatch = useDispatch()
  const [updateCardsFn] = useStatefulApolloMutation(updateDashboardCardStateMutation, {
    onError: error => console.error(error.message),
    variables: { dashboardId: '' },
  })

  const options = cardState[id].options
  if (typeof options !== 'undefined') {
    const chartTabOption = options[CHART_TAB_OPTION]
    if (typeof chartTabOption !== 'undefined') {
      currentTabIndex = chartTabOption as number
    }
  }

  const handleTabChange: ChartTabsProps['handleTabChange'] = useCallback(
    event => {
      const dataIndex = event.currentTarget.getAttribute('data-index')
      const newIndex = parseInt(dataIndex, 10)
      // NaN is not >=0 or <0
      // eslint-disable-next-line sonarjs/no-inverted-boolean-check
      if (!(newIndex >= 0)) {
        throw new Error(`data-index property must be set when using useChartTabs().handleTabChanged`)
      }
      dispatch(
        updateCardState({
          cardInfo: { id, option: CHART_TAB_OPTION, value: newIndex },
          updateFn: updateCardsFn,
        }),
      )
    },
    [dispatch, id, updateCardsFn],
  )

  return { currentTabIndex, handleTabChange }
}
