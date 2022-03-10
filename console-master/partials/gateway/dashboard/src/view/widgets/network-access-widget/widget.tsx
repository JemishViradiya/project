//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { ChartErrorHandler, WIDGET_TABS_HEIGHT, WidgetTabs } from '@ues-behaviour/dashboard'
import type { ReportingServiceNetworkRouteType } from '@ues-data/gateway'
import { ReportingServiceFilter } from '@ues-data/gateway'
import { Config, Data, Hooks } from '@ues-gateway/shared'

import { useDataLayer } from '../hooks'
import { BytesChart } from './bytes-chart'
import { DATA_INTERVAL } from './constants'
import { EventsChart } from './events-chart'
import { UsersChart } from './users-chart'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { queryNetworkAccessTrafficSummary } = Data

const { useBytesFormatterResolver, Abbreviation } = Hooks

interface NetworkAccessWidgetProps extends ChartProps {
  networkRouteType: ReportingServiceNetworkRouteType
}

const NoDataComponent = <ChartErrorHandler noData fallbackStyles={{ alignItems: 'center', marginTop: '15%' }} />

export const NetworkAccessWidget: React.FC<NetworkAccessWidgetProps> = ({ id, globalTime, height, networkRouteType }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const bytesFormatterResolver = useBytesFormatterResolver()

  const { data, startDate, endDate } = useDataLayer({
    query: queryNetworkAccessTrafficSummary,
    globalTime,
    defaultQueryVariables: {
      interval: DATA_INTERVAL[globalTime.timeInterval],
      filter: { [ReportingServiceFilter.NetworkRoute]: networkRouteType },
    },
  })

  const { eventsData, bytesData, usersData } = useMemo(
    () => ({
      ...data?.tenant?.tunnelTimeAgg?.reduce(
        (acc, item) => {
          const key = Number(item.key)
          return {
            eventsData: {
              allowedTraffic: [...acc.eventsData.allowedTraffic, [key, item.allowed]],
              blockedTraffic: [...acc.eventsData.blockedTraffic, [key, item.blocked]],
            },
            bytesData: {
              uploaded: [
                ...acc.bytesData.uploaded,
                [key, bytesFormatterResolver(item?.traffic?.bytes_toserver, 3, Abbreviation.GB, false)],
              ],
              downloaded: [
                ...acc.bytesData.downloaded,
                [key, bytesFormatterResolver(item?.traffic?.bytes_toclient, 3, Abbreviation.GB, false)],
              ],
            },
            usersData: [...acc.usersData, [key, item?.fieldCounts[0]?.count]],
          }
        },
        {
          eventsData: {
            allowedTraffic: [],
            blockedTraffic: [],
          },
          bytesData: {
            uploaded: [],
            downloaded: [],
          },
          usersData: [],
        },
      ),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.tenant?.tunnelTimeAgg],
  )

  const chartProps = useMemo(
    () => ({
      // Height of any content placed above the chart needs to be subtracted from ChartProps height
      chartHeight: height - WIDGET_TABS_HEIGHT,
      id,
      globalTime,
      startDate,
      endDate,
      networkRouteType,
    }),
    [startDate, endDate, globalTime, height, id, networkRouteType],
  )

  return (
    <WidgetTabs
      id={id}
      items={[
        {
          label: t('common.connections'),
          component:
            isEmpty(eventsData?.allowedTraffic) && isEmpty(eventsData?.blockedTraffic) ? (
              NoDataComponent
            ) : (
              <EventsChart {...chartProps} data={eventsData} />
            ),
        },
        {
          label: t('common.users'),
          component: isEmpty(usersData) ? NoDataComponent : <UsersChart {...chartProps} data={usersData} />,
        },
        {
          label: t('dashboard.bytes'),
          component:
            isEmpty(bytesData?.downloaded) && isEmpty(bytesData?.uploaded) ? (
              NoDataComponent
            ) : (
              <BytesChart {...chartProps} data={bytesData} />
            ),
        },
      ]}
    />
  )
}
