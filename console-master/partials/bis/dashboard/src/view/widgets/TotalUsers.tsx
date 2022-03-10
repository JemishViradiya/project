//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { Count, getDateRangeTimestampString } from '@ues-behaviour/dashboard'
import { UserCountQuery } from '@ues-data/bis'
import { useStatefulApolloSubscription } from '@ues-data/shared'
import { BasicUsersRound } from '@ues/assets'

import { convertRangeBoundaryToSeconds } from './utils'

const TotalUsers: React.FC<ChartProps> = memo(({ globalTime }) => {
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

  const { data: countData } = useStatefulApolloSubscription(UserCountQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })

  if (!countData) {
    return null
  }

  return <Count icon={BasicUsersRound} count={countData.userCount} description={t('dashboard.totalUsersWidgetDescription')} />
})

export default TotalUsers
