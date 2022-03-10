/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { TopThreats, TreeMap } from '@ues-behaviour/dashboard'
import { EppDashboardData } from '@ues-data/epp'
import { useStatefulApolloQuery } from '@ues-data/shared'

import { getThreatClassifications, getThreatsByPriority } from '../../data/topThreats'
import { ChartWidget } from './chartWidget'

const ThreatsByPriority = (props: ChartProps): JSX.Element => {
  const { threatsByPriority } = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice].tasks)

  const topThreats = useMemo(
    () =>
      threatsByPriority.loading
        ? null
        : {
            total: threatsByPriority.result.TotalInstances,
            high: {
              threats: threatsByPriority.result.HighPriorityThreats.ThreatCount || 0,
              percentage: threatsByPriority.result.HighPriorityThreats.PercentageFromTotal || 0,
              devices: threatsByPriority.result.HighPriorityThreats.ThreatCount || 0,
            },
            medium: {
              threats: threatsByPriority.result.MediumPriorityThreats.ThreatCount || 0,
              percentage: threatsByPriority.result.MediumPriorityThreats.PercentageFromTotal || 0,
              devices: threatsByPriority.result.MediumPriorityThreats.ThreatCount || 0,
            },
            low: {
              threats: threatsByPriority.result.LowPriorityThreats.ThreatCount || 0,
              percentage: threatsByPriority.result.LowPriorityThreats.PercentageFromTotal || 0,
              devices: threatsByPriority.result.LowPriorityThreats.ThreatCount || 0,
            },
          },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threatsByPriority],
  )

  return (
    <ChartWidget {...props}>
      {threatsByPriority.loading || <TopThreats title="Threats by Priority" data={topThreats} />}
    </ChartWidget>
  )
}

const transformData = ({ ThreatCount, Name, Items }) => {
  const data: { name: string; value: number; children?: unknown[] } = {
    name: Name,
    value: ThreatCount,
  }
  if (Items) {
    data.children = Items.map(transformData)
  }
  return data
}

const ThreatClassifications = (props: ChartProps): JSX.Element => {
  const { loading: malwareLoading, data: malwareData } = useStatefulApolloQuery(getThreatClassifications, {
    variables: { className: 'Malware' },
  })
  const { loading: pupLoading, data: pupData } = useStatefulApolloQuery(getThreatClassifications, {
    variables: { className: 'PUP' },
  })

  const loading = malwareLoading || pupLoading

  const topThreats = useMemo(
    () =>
      loading
        ? null
        : {
            series: [].concat(
              malwareData.threatClassifications.map(transformData),
              pupData.threatClassifications.map(transformData),
            ),
            title: 'Threat Classifications',
          },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, malwareData && malwareData.threatClassifications, pupData && pupData.threatClassifications],
  )

  return <ChartWidget {...props}>{loading || <TreeMap height={props.height} data={topThreats} />}</ChartWidget>
}

export { ThreatsByPriority, ThreatClassifications }
