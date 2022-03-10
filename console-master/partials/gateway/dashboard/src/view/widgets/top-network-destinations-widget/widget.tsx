//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, orderBy } from 'lodash-es'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { ChartErrorHandler, TopList, WidgetTabs } from '@ues-behaviour/dashboard'
import type { ReportingServiceNetworkRouteType } from '@ues-data/gateway'
import {
  DASHBOARD_WIDGET_MAX_RECORDS_COUNT,
  ReportingServiceBucketField,
  ReportingServiceFilter,
  ReportingServiceSortDirection,
} from '@ues-data/gateway'
import { Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'

import { useDataLayer } from '../hooks'

interface TopNetworkDestinationsWidgetProps extends ChartProps {
  networkRouteType: ReportingServiceNetworkRouteType
}

const { queryTopNetworkDestinations } = Data
const { Page } = Types
const { makePageRoute } = Utils
const { useBytesFormatterResolver } = Hooks

const NoDataComponent = <ChartErrorHandler noData fallbackStyles={{ alignItems: 'center', marginTop: '50%' }} />

export const TopNetworkDestinationsWidget: React.FC<TopNetworkDestinationsWidgetProps> = ({ id, globalTime, networkRouteType }) => {
  const { t } = useTranslation([Config.GATEWAY_TRANSLATIONS_KEY])
  const bytesFormatterResolver = useBytesFormatterResolver()

  const { data, startDate, endDate } = useDataLayer({
    query: queryTopNetworkDestinations,
    globalTime,
    defaultQueryVariables: {
      maxRecords: DASHBOARD_WIDGET_MAX_RECORDS_COUNT,
      sort: [{ bucketOrder: ReportingServiceBucketField.Count, order: ReportingServiceSortDirection.Desc }],
      filter: { [ReportingServiceFilter.NetworkRoute]: networkRouteType },
    },
  })

  const { bytes, connections, users } = (data?.tenant?.tunnelAgg?.buckets ?? []).reduce(
    (acc, item) => ({
      bytes: [...acc.bytes, { label: item.key, count: item.traffic?.bytes_total }],
      connections: [...acc.connections, { label: item.key, count: item.count }],
      users: [...acc.users, { label: item.key, count: item.fieldCounts[0].count }],
    }),
    { bytes: [], connections: [], users: [] },
  )

  const handleItemClick = useCallback(
    ({ label }) =>
      window.location.assign(
        makePageRoute(Page.GatewayExternalEvents, {
          queryStringParams: { startDate, endDate, [ReportingServiceFilter.Destination]: label },
        }),
      ),
    [startDate, endDate],
  )

  return (
    <WidgetTabs
      id={id}
      items={[
        {
          label: t('common.connections'),
          component: isEmpty(connections) ? NoDataComponent : <TopList data={connections} onInteraction={handleItemClick} />,
        },
        {
          label: t('common.users'),
          component: isEmpty(users) ? NoDataComponent : <TopList data={users} onInteraction={handleItemClick} />,
        },
        {
          label: t('dashboard.bytes'),
          component: isEmpty(bytes) ? (
            NoDataComponent
          ) : (
            <TopList data={orderBy(bytes, 'count', 'desc')} onInteraction={handleItemClick} formatter={bytesFormatterResolver} />
          ),
        },
      ]}
    />
  )
}
