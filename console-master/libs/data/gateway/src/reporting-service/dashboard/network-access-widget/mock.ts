//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import moment from 'moment'

import type { ReportingServiceTunnelTimeAggResponse } from '../../types'
import { ReportingServiceInterval, ReportingServiceNetworkRouteType } from '../../types'

type NetworkAccessSummaryResponse = Record<
  ReportingServiceNetworkRouteType.Private | ReportingServiceNetworkRouteType.Public,
  Record<ReportingServiceInterval, ReportingServiceTunnelTimeAggResponse>
>

enum NetworkAccessDataType {
  Traffic = 'traffic',
  Bytes = 'bytes',
  User = 'user',
  Summary = 'summary',
}

const getTimestampFromInterval = (interval: ReportingServiceInterval | `${ReportingServiceInterval}`, index: number) => {
  const isFirstIndex = index === 0

  const minTimestamps = {
    [ReportingServiceInterval.Day]: moment().subtract(1, 'days'),
    [ReportingServiceInterval.Hour]: moment().subtract(1, 'hours'),
    [ReportingServiceInterval.Minute]: moment().subtract(1, 'minutes'),
    [ReportingServiceInterval.Month]: moment().subtract(1, 'months'),
    [ReportingServiceInterval.Quarter]: moment().subtract(3, 'months'),
    [ReportingServiceInterval.Week]: moment().subtract(7, 'days'),
    [ReportingServiceInterval.Year]: moment().subtract(1, 'years'),
  }

  const timeProps: Record<
    ReportingServiceInterval,
    {
      min: number
      max: number
      factor: moment.unitOfTime.DurationConstructor
    }
  > = {
    [ReportingServiceInterval.Day]: {
      min: 0,
      max: 24,
      factor: 'hours',
    },
    [ReportingServiceInterval.Hour]: {
      min: 0,
      max: 24,
      factor: 'minutes',
    },
    [ReportingServiceInterval.Minute]: {
      min: 0,
      max: 60,
      factor: 'seconds',
    },
    [ReportingServiceInterval.Month]: {
      min: 0,
      max: 30,
      factor: 'days',
    },
    [ReportingServiceInterval.Quarter]: {
      min: 0,
      max: 90,
      factor: 'days',
    },
    [ReportingServiceInterval.Week]: {
      min: 0,
      max: 7,
      factor: 'days',
    },
    [ReportingServiceInterval.Year]: {
      min: 0,
      max: 12,
      factor: 'months',
    },
  }

  const minTimestamp = minTimestamps[interval]
  const maxTimestamp = moment().valueOf()

  if (isFirstIndex) {
    return minTimestamp.valueOf()
  }

  const timeToAdd = minTimestamp.add(index, timeProps[interval].factor).valueOf()

  return timeToAdd > maxTimestamp ? maxTimestamp : timeToAdd
}

const generateTenantData = (
  type: NetworkAccessDataType | `${NetworkAccessDataType}`,
  serviceInterval: ReportingServiceInterval | `${ReportingServiceInterval}`,
) => {
  const getSmallRangeNumber = () => Math.floor(Math.random() * 40)
  const getBigRangeNumber = () => Math.floor(Math.random() * 38860000000)

  const getTunnelTimeAgg = () =>
    Array.from({ length: getSmallRangeNumber() }).map((_, index) => ({
      key: getTimestampFromInterval(serviceInterval, index),
      allowed: getSmallRangeNumber(),
      blocked: getSmallRangeNumber(),
      count: getSmallRangeNumber(),
      fieldCounts: [
        {
          count: getSmallRangeNumber(),
        },
      ],
      traffic: {
        bytes_toclient: getBigRangeNumber(),
        bytes_toserver: getBigRangeNumber(),
      },
    }))

  return {
    tunnelTimeAgg: getTunnelTimeAgg(),
  }
}

const generateReportingServiceMockData = <T = NetworkAccessSummaryResponse>(
  type: NetworkAccessDataType | `${NetworkAccessDataType}`,
) => {
  return Object.values(ReportingServiceNetworkRouteType).reduce(
    (acc, currentType) => ({
      [currentType]: Object.values(ReportingServiceInterval).reduce(
        (acc, serviceInterval) => ({
          [serviceInterval]: {
            tenant: generateTenantData(type, serviceInterval),
          },
          ...acc,
        }),
        {},
      ),
      ...acc,
    }),
    {} as T,
  )
}

export const networkAccessTrafficSummaryMock = generateReportingServiceMockData<NetworkAccessSummaryResponse>(
  NetworkAccessDataType.Summary,
)
