//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { getDateRangeTimestampString, TopList } from '@ues-behaviour/dashboard'
import { TopActionsQuery } from '@ues-data/bis'
import { ActionType } from '@ues-data/bis/model'
import { useStatefulApolloSubscription } from '@ues-data/shared'

import { convertRangeBoundaryToSeconds, isKnownAction } from './utils'

const TopCount = 20

const getTitle = (action, t) => {
  let title
  let subtitle
  if (action.type === ActionType.OverrideNetworkAccessControlPolicy) {
    title = action.name || action.entityId
    subtitle = t('bis/ues:actionType.overrideNetworkAccessPolicy')
  } else {
    console.log('Warning: unknown action type', action.type)
    title = action.type
  }
  return { title, subtitle }
}

const TopActions: React.FC<ChartProps> = memo(({ globalTime }) => {
  const { t } = useTranslation(['bis/ues'])
  const { startDate, endDate } = useMemo(() => getDateRangeTimestampString(globalTime), [globalTime])
  const variables = useMemo(
    () => ({
      range: {
        start: convertRangeBoundaryToSeconds(startDate),
        end: convertRangeBoundaryToSeconds(endDate),
      },
      count: TopCount,
    }),
    [endDate, startDate],
  )
  const { data } = useStatefulApolloSubscription(TopActionsQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })

  const items = useMemo(
    () =>
      (data?.topActions ?? [])
        .filter(item => isKnownAction(item.action))
        .map(item => {
          const { title, subtitle } = getTitle(item.action, t)
          return {
            label: title,
            secondary: subtitle,
            count: item.count,
          }
        }),
    [data?.topActions, t],
  )

  if (!data || !data.topActions) {
    return null
  }

  return <TopList data={items} />
})

export default TopActions
