//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { getDateRangeTimestampString, IconListWithValues } from '@ues-behaviour/dashboard'
import { getRiskLevelColor } from '@ues-bis/shared'
import { RiskSummaryQuery } from '@ues-data/bis'
import type { RiskTypes } from '@ues-data/bis/model'
import { RiskLevelTypes } from '@ues-data/bis/model'
import { useStatefulApolloSubscription } from '@ues-data/shared'
import { StatusCritical, StatusHigh, StatusLow, StatusMedium, StatusUnknown } from '@ues/assets'

import { convertRangeBoundaryToSeconds, isAlertRiskLevel, isSupportedRiskType } from './utils'

const AlertSummary: React.FC<ChartProps> = memo(({ globalTime }) => {
  const theme = useTheme()
  const { startDate, endDate } = useMemo(() => getDateRangeTimestampString(globalTime), [globalTime])
  const { t } = useTranslation('bis/ues')

  const variables = useMemo(
    () => ({
      range: {
        start: convertRangeBoundaryToSeconds(startDate),
        end: convertRangeBoundaryToSeconds(endDate),
      },
    }),
    [endDate, startDate],
  )
  const { data } = useStatefulApolloSubscription(RiskSummaryQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })

  const getIcon = useCallback(
    item => {
      const { value: riskLevel } = item
      const color = getRiskLevelColor(riskLevel, theme)
      let icon
      switch (riskLevel) {
        case RiskLevelTypes.CRITICAL:
          icon = StatusCritical
          break
        case RiskLevelTypes.HIGH:
          icon = StatusHigh
          break
        case RiskLevelTypes.MEDIUM:
          icon = StatusMedium
          break
        case RiskLevelTypes.LOW:
          icon = StatusLow
          break
        default:
          icon = StatusUnknown
          break
      }
      return { icon, color }
    },
    [theme],
  )

  const items = useMemo(
    () =>
      (data?.riskSummary ?? [])
        .filter(rs => isSupportedRiskType(rs.key as RiskTypes))
        .filter(rs => isAlertRiskLevel(rs.value))
        .map(item => {
          const { icon, color } = getIcon(item)
          const { value: riskLevel, count } = item
          return {
            icon,
            label: t(`bis/ues:dashboard.networkAlertSummaryWidget.label.${riskLevel.toLowerCase()}`),
            count,
            color,
          }
        }),
    [data?.riskSummary, getIcon, t],
  )

  if (!data || !data.riskSummary) {
    return null
  }

  return <IconListWithValues data={items} />
})

export default AlertSummary
