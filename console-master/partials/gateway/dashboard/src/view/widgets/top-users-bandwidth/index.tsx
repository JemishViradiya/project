//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { ChartErrorHandler, TopList, WidgetTabs } from '@ues-behaviour/dashboard'
import { DASHBOARD_WIDGET_MAX_RECORDS_COUNT, ReportingServiceNetworkRouteType } from '@ues-data/gateway'
import { Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'

import { useDataLayer } from '../hooks'

const { queryTopUsersBandwidth } = Data

const { makePageRoute } = Utils
const { Page } = Types
const { useBytesFormatterResolver } = Hooks

const NoDataComponent = <ChartErrorHandler noData fallbackStyles={{ alignItems: 'center', marginTop: '15%' }} />

export const TopUsersBandwidth: React.FC<ChartProps> = memo(({ id, globalTime }) => {
  const { t } = useTranslation([Config.GATEWAY_TRANSLATIONS_KEY])

  const bytesFormatterResolver = useBytesFormatterResolver()

  const { data, startDate, endDate } = useDataLayer({
    query: queryTopUsersBandwidth,
    globalTime,
    defaultQueryVariables: { maxRecords: DASHBOARD_WIDGET_MAX_RECORDS_COUNT },
  })

  const getUserInfo = useCallback(
    (query: ReportingServiceNetworkRouteType | 'all') =>
      data?.tenant[query]?.userInfo?.reduce(
        (acc, { ecoId, displayName }) => ({
          ...acc,
          [ecoId]: displayName,
        }),
        {},
      ),
    [data?.tenant],
  )

  const getData = useCallback(
    (query: ReportingServiceNetworkRouteType | 'all') => {
      const usersInfo = getUserInfo(query)

      return (data?.tenant[query]?.buckets ?? []).map(item => {
        return {
          label: usersInfo[item.key],
          count: item?.traffic?.bytes_total,
        }
      })
    },
    [data?.tenant, getUserInfo],
  )

  const publicUsers = getData(ReportingServiceNetworkRouteType.Public)
  const privateUsers = getData(ReportingServiceNetworkRouteType.Private)
  const allUsers = getData('all')

  const onInteraction = useCallback(
    item =>
      window.location.assign(
        makePageRoute(Page.GatewayExternalEvents, {
          queryStringParams: { startDate, endDate, displayName: item.label },
        }),
      ),
    [endDate, startDate],
  )

  return (
    <WidgetTabs
      id={id}
      items={[
        {
          label: t('events.networkRouteAll'),
          component: !allUsers ? (
            NoDataComponent
          ) : (
            <TopList data={allUsers} onInteraction={onInteraction} formatter={bytesFormatterResolver} />
          ),
        },
        {
          label: t('events.networkRoutePublic'),
          component: !publicUsers ? (
            NoDataComponent
          ) : (
            <TopList data={publicUsers} onInteraction={onInteraction} formatter={bytesFormatterResolver} />
          ),
        },
        {
          label: t('events.networkRoutePrivate'),
          component: !privateUsers ? (
            NoDataComponent
          ) : (
            <TopList data={privateUsers} onInteraction={onInteraction} formatter={bytesFormatterResolver} />
          ),
        },
      ]}
    />
  )
})
