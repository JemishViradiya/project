//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { TFunction } from 'i18next'
import { isEmpty, isNil } from 'lodash-es'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

import type { ReportingServiceQueryFilters, ReportingServiceQueryVariables } from '@ues-data/gateway'
import type { Types } from '@ues-gateway/shared'
import { Config, Utils } from '@ues-gateway/shared'
import { OPERATOR_VALUES, TableSortDirection } from '@ues/behaviours'

import {
  ACTION_LOCALIZATION_KEYS,
  EVENTS_QUERY_SORT_TO_TABLE_SORT_BY,
  EVENTS_QUERY_SORT_TO_TABLE_SORT_ORDER,
  NETWORK_ROUTE_LOCALIZATION_KEYS,
} from '../constants'
import type { EventsTableFilter } from '../types'
import { EventsColumnDataKey } from '../types'
import { useEventsLocationState } from './use-events-location-state'

const { formatTimestamp, makeDefaultDateRange } = Utils
const { GATEWAY_TRANSLATIONS_KEY } = Config

export interface DefaultSortType {
  sortBy: EventsColumnDataKey
  sortDirection: TableSortDirection
}

export const useDefaultSort = (defaultQueryVariables: ReportingServiceQueryVariables): DefaultSortType => {
  if (isEmpty(defaultQueryVariables?.sort)) {
    return { sortBy: null, sortDirection: TableSortDirection.Desc }
  }

  const { order, bucketOrder, field } = defaultQueryVariables.sort[0]

  return {
    sortBy: EVENTS_QUERY_SORT_TO_TABLE_SORT_BY[field ?? bucketOrder],
    sortDirection: EVENTS_QUERY_SORT_TO_TABLE_SORT_ORDER[order],
  }
}

const COLUMN_QUERY_FILTER_KEYS_RESOLVERS: Partial<
  Record<
    EventsColumnDataKey,
    (args: {
      filter: ReportingServiceQueryFilters
      t?: TFunction
      locationState: Types.GatewayEventsRouteQueryParams
    }) => EventsTableFilter
  >
> = {
  [EventsColumnDataKey.DateRange]: ({ locationState }) => {
    if (isEmpty(locationState?.startDate) || isEmpty(locationState?.endDate)) return

    const { startDate, endDate } = makeDefaultDateRange(locationState)

    return {
      minDatetime: moment(Number(startDate)),
      maxDatetime: moment(Number(endDate)),
      minDatetimeLabel: formatTimestamp(startDate),
      maxDatetimeLabel: formatTimestamp(endDate),
      operator: OPERATOR_VALUES.IS_BETWEEN,
    }
  },

  [EventsColumnDataKey.Action]: ({ filter, t }) =>
    filter?.alertAction && {
      value: t(ACTION_LOCALIZATION_KEYS[filter.alertAction]),
    },

  [EventsColumnDataKey.NetworkRoute]: ({ filter, t }) =>
    filter?.networkRoute && {
      value: t(NETWORK_ROUTE_LOCALIZATION_KEYS[filter.networkRoute]),
    },

  [EventsColumnDataKey.Destination]: ({ locationState }) =>
    locationState?.destination && {
      value: locationState.destination,
      operator: OPERATOR_VALUES.EQUAL,
    },

  [EventsColumnDataKey.TlsVersion]: ({ filter }) =>
    filter?.tlsVersion && {
      value: filter.tlsVersion,
    },

  [EventsColumnDataKey.User]: ({ locationState }) =>
    locationState?.displayName && {
      value: locationState.displayName,
    },

  [EventsColumnDataKey.TransferredTotal]: ({ filter }) =>
    filter?.bytesToClient && {
      value: [filter.bytesToClient.from, filter.bytesToClient.to],
      operator: OPERATOR_VALUES.IS_BETWEEN,
    },
}

export const useDefaultFilters = (pickColumns: EventsColumnDataKey[], defaultQueryVariables: ReportingServiceQueryVariables) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const locationState = useEventsLocationState()

  return pickColumns.reduce((acc, columnKey) => {
    const resolvedFilter = COLUMN_QUERY_FILTER_KEYS_RESOLVERS?.[columnKey]?.({
      filter: defaultQueryVariables?.filter,
      t,
      locationState,
    })

    if (isNil(resolvedFilter)) return acc

    return { ...acc, [columnKey]: resolvedFilter }
  }, {})
}
