//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { Count, getDateRangeTimestampString } from '@ues-behaviour/dashboard'
import { EventCountQuery } from '@ues-data/bis'
import { useStatefulApolloSubscription } from '@ues-data/shared'
import { BasicEvents } from '@ues/assets'

import { convertRangeBoundaryToSeconds } from './utils'

const TotalEvents: React.FC<ChartProps> = memo(({ globalTime }) => {
  const { t } = useTranslation('bis/ues')

  const variables = useMemo(() => {
    const { startDate, endDate } = getDateRangeTimestampString(globalTime)

    return {
      range: {
        start: convertRangeBoundaryToSeconds(startDate),
        end: convertRangeBoundaryToSeconds(endDate),
      },
    }
  }, [globalTime])

  const { data: countData } = useStatefulApolloSubscription(EventCountQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })

  if (!countData) {
    return null
  }

  return <Count icon={BasicEvents} count={countData.eventCount} description={t('dashboard.totalEventsWidgetDescription')} />
})

export default TotalEvents
