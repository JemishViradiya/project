//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { TFunction } from 'i18next'

import type { ReportingServiceQueryFilters, ReportingServiceQueryVariables } from '@ues-data/gateway'
import {
  ReportingServiceAccessRequestType,
  ReportingServiceAlertAction,
  ReportingServiceAlertType,
  ReportingServiceBucketField,
  ReportingServiceField,
  ReportingServiceFilter,
  ReportingServiceFilterOperator,
  ReportingServiceMatch,
  ReportingServiceNetworkRouteType,
  ReportingServiceSortDirection,
} from '@ues-data/gateway'
import { FeaturizationApi } from '@ues-data/shared'
import { FeatureName } from '@ues-data/shared-types'
import { Config, Types, Utils } from '@ues-gateway/shared'
import { OPERATOR_VALUES, TableSortDirection } from '@ues/behaviours'

import type { EventsTableFilter } from './types'
import { EventsColumnDataKey, EventsListName } from './types'
import { resolveDateRangeQueryFilter } from './utils'

const { makeBytesTotalFilter } = Utils
const { EVENTS_QUERY_MAX_RECORDS } = Config

export const QUICK_SEARCH_FILTER_DEBOUNCE_INTERVAL = 600

export const ASYNCHRONOUS_FILTER_KEYS = [EventsColumnDataKey.User]
export const SYNCHRONOUS_FILTER_KEYS = [
  EventsColumnDataKey.Action,
  EventsColumnDataKey.Anomaly,
  EventsColumnDataKey.AppProtocol,
  EventsColumnDataKey.Category,
  EventsColumnDataKey.DateRange,
  EventsColumnDataKey.Destination,
  EventsColumnDataKey.DestinationPort,
  EventsColumnDataKey.NetworkRoute,
  EventsColumnDataKey.RuleNames,
  EventsColumnDataKey.SourceIp,
  EventsColumnDataKey.TlsVersion,
  EventsColumnDataKey.TransferredTotal,
]

export const QUERY_FILTER_KEYS_RESOLVERS: Partial<
  Record<
    EventsColumnDataKey,
    (filter: {
      activeFilter: EventsTableFilter
      t?: TFunction
      ecoIds?: string[]
      listName: EventsListName
      categoryNamesMap?: Record<string, string>
    }) => ReportingServiceQueryFilters
  >
> = {
  [EventsColumnDataKey.Anomaly]: ({ activeFilter, t }) => {
    const anomalyFilterValuesMap = {
      [t(ANOMALY_FILTER_LOCALIZATION_KEYS.BEHAVIOURAL_RISK)]: { anomaly: true },
      [t(ANOMALY_FILTER_LOCALIZATION_KEYS[ReportingServiceAlertType.IpReputation])]: {
        alertTypes: [ReportingServiceAlertType.IpReputation],
      },
      [t(ANOMALY_FILTER_LOCALIZATION_KEYS[ReportingServiceAlertType.Signature])]: {
        alertTypes: [ReportingServiceAlertType.Signature],
      },
      [t(ANOMALY_FILTER_LOCALIZATION_KEYS[ReportingServiceAlertType.DnsTunneling])]: {
        alertTypes: [ReportingServiceAlertType.DnsTunneling],
      },
    }

    const anomalyFilterValues = activeFilter.value?.map(key => anomalyFilterValuesMap[key])

    return anomalyFilterValues.length === 1 ? anomalyFilterValues[0] : { [ReportingServiceFilterOperator.Or]: anomalyFilterValues }
  },

  [EventsColumnDataKey.DateRange]: ({ activeFilter, listName }) => {
    const { startDate, endDate } = resolveDateRangeQueryFilter(activeFilter)

    return {
      [TIMESTAMP_ORDER_QUERY_KEY[listName]]: {
        from: startDate,
        to: endDate,
      },
    }
  },

  [EventsColumnDataKey.TlsVersion]: ({ activeFilter }) => ({ [ReportingServiceFilter.TlsVersion]: activeFilter?.value }),

  [EventsColumnDataKey.Category]: ({ activeFilter, categoryNamesMap }) => {
    const categoryFilterValues = activeFilter?.value?.map((categoryName: string) => ({
      [ReportingServiceFilter.Category]: Number(categoryNamesMap[categoryName]),
    }))

    return categoryFilterValues.length === 1
      ? categoryFilterValues[0]
      : { [ReportingServiceFilterOperator.Or]: categoryFilterValues }
  },

  [EventsColumnDataKey.Destination]: ({ activeFilter }) => getFieldMatchFilter(ReportingServiceFilter.DestMatch, activeFilter),

  [EventsColumnDataKey.DestinationPort]: ({ activeFilter }) => ({
    [ReportingServiceFilter.DestinationPort]: {
      from: activeFilter?.value,
      to: activeFilter?.value,
    },
  }),

  [EventsColumnDataKey.TransferredTotal]: ({ activeFilter }) => makeBytesTotalFilter(activeFilter),

  [EventsColumnDataKey.Action]: ({ activeFilter, t }) => {
    const ALERT_ACTION_FILTER_VALUE = {
      [t(ACTION_LOCALIZATION_KEYS[ReportingServiceAlertAction.Allowed])]: ReportingServiceAlertAction.Allowed,
      [t(ACTION_LOCALIZATION_KEYS[ReportingServiceAlertAction.Blocked])]: ReportingServiceAlertAction.Blocked,
    }

    return { [ReportingServiceFilter.AlertAction]: ALERT_ACTION_FILTER_VALUE[activeFilter?.value] }
  },

  [EventsColumnDataKey.NetworkRoute]: ({ activeFilter, t }) => {
    const NETWORK_ROUTE_FILTER_VALUE = {
      [t(NETWORK_ROUTE_LOCALIZATION_KEYS[ReportingServiceNetworkRouteType.Public])]: ReportingServiceNetworkRouteType.Public,
      [t(NETWORK_ROUTE_LOCALIZATION_KEYS[ReportingServiceNetworkRouteType.Private])]: ReportingServiceNetworkRouteType.Private,
    }

    return { [ReportingServiceFilter.NetworkRoute]: NETWORK_ROUTE_FILTER_VALUE[activeFilter?.value] }
  },

  [EventsColumnDataKey.AppProtocol]: ({ activeFilter }) => getFieldMatchFilter(ReportingServiceFilter.AppProtoMatch, activeFilter),

  [EventsColumnDataKey.RuleNames]: ({ activeFilter }) => getFieldMatchFilter(ReportingServiceFilter.RuleNameMatch, activeFilter),

  [EventsColumnDataKey.SourceIp]: ({ activeFilter }) => ({ [ReportingServiceFilter.SourceIp]: activeFilter?.value }),

  [EventsColumnDataKey.PolicyName]: ({ activeFilter }) => ({ [ReportingServiceFilter.AlertPolicyName]: activeFilter?.value }),

  [EventsColumnDataKey.User]: ({ ecoIds }) => ({ [ReportingServiceFilter.EcoIds]: ecoIds }),
}

export const QUERY_SORT_KEYS_RESOLVERS: Partial<
  Record<EventsColumnDataKey, (args: { sortDirection: string; listName: EventsListName }) => ReportingServiceQueryVariables['sort']>
> = {
  [EventsColumnDataKey.Category]: ({ sortDirection }) => [
    {
      field: ReportingServiceField.Category,
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.Platform]: ({ sortDirection }) => [
    {
      field: ReportingServiceField.DevicePlatform,
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.Model]: ({ sortDirection }) => [
    {
      field: ReportingServiceField.DeviceModelName,
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.RuleNames]: ({ sortDirection }) => [
    {
      field: ReportingServiceField.RuleName,
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.TransferredTotal]: ({ sortDirection, listName }) => [
    {
      ...(listName === EventsListName.NetworkTraffic
        ? { field: ReportingServiceField.BytesTotal }
        : { bucketOrder: ReportingServiceBucketField.BytesTotal }),
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.PolicyName]: ({ sortDirection }) => [
    {
      field: ReportingServiceField.PolicyName,
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.NetworkRoute]: ({ sortDirection }) => [
    {
      field: ReportingServiceField.NetworkRoute,
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.Action]: ({ sortDirection }) => [
    {
      field: ReportingServiceField.Action,
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.SourceIp]: ({ sortDirection }) => [
    {
      field: ReportingServiceField.SourceIp,
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.TlsVersion]: ({ sortDirection }) => [
    {
      field: ReportingServiceField.TlsVersion,
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.RiskScore]: ({ sortDirection }) => [
    {
      field: ReportingServiceField.BisScore,
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.AppProtocol]: ({ sortDirection }) => [
    {
      field: ReportingServiceField.AppProto,
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.DateRange]: ({ sortDirection, listName }) => [
    {
      ...(listName === EventsListName.NetworkTraffic
        ? { field: ReportingServiceField.TsStart }
        : { bucketOrder: ReportingServiceBucketField.MaxTsTerm }),
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.ConnectionsCount]: ({ sortDirection }) => [
    {
      bucketOrder: ReportingServiceBucketField.Count,
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.Destination]: ({ sortDirection, listName }) => [
    {
      ...(listName === EventsListName.NetworkTraffic
        ? { field: ReportingServiceField.AppDest }
        : { bucketOrder: ReportingServiceBucketField.Key }),
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
  [EventsColumnDataKey.DestinationPort]: ({ sortDirection, listName }) => [
    {
      ...(listName === EventsListName.NetworkTraffic
        ? { field: ReportingServiceField.DestinationPort }
        : { bucketOrder: ReportingServiceBucketField.Key }),
      order: TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER[sortDirection],
    },
  ],
}

export const EVENTS_QUERY_SORT_TO_TABLE_SORT_BY = {
  [ReportingServiceField.Anomaly]: EventsColumnDataKey.Anomaly,
  [ReportingServiceField.AppProto]: EventsColumnDataKey.AppProtocol,
  [ReportingServiceField.BisScore]: EventsColumnDataKey.RiskScore,
  [ReportingServiceBucketField.MaxTsTerm]: EventsColumnDataKey.DateRange,
  [ReportingServiceField.TsStart]: EventsColumnDataKey.DateRange,
}

export const ACTION_LOCALIZATION_KEYS = {
  [ReportingServiceAlertAction.Allowed]: 'common.allowed',
  [ReportingServiceAlertAction.Blocked]: 'common.blocked',
}

export const ALERT_TYPE_LOCALIZATION_KEYS = {
  ...(FeaturizationApi.isFeatureEnabled(FeatureName.UESBigDnsTunnelingEnabled) && {
    [ReportingServiceAlertType.DnsTunneling]: 'events.dnsTunneling',
  }),
  [ReportingServiceAlertType.IpReputation]: 'events.ipReputation',
  [ReportingServiceAlertType.Signature]: 'events.signature',
}

export const ANOMALY_FILTER_LOCALIZATION_KEYS = {
  BEHAVIOURAL_RISK: 'events.behaviouralRisk',
  ...ALERT_TYPE_LOCALIZATION_KEYS,
}

export const TIMESTAMP_ORDER_QUERY_KEY = {
  [EventsListName.NetworkTraffic]: ReportingServiceFilter.TsStart,
  [EventsListName.AggregatedNetworkTraffic]: ReportingServiceFilter.TsTerm,
}

export const NETWORK_ROUTE_LOCALIZATION_KEYS = {
  [ReportingServiceNetworkRouteType.Public]: 'events.networkRoutePublic',
  [ReportingServiceNetworkRouteType.Private]: 'events.networkRoutePrivate',
}

export const ACCESS_REQUEST_TYPE_KEYS = {
  [ReportingServiceAccessRequestType.IpRequest]: 'events.rules.ipRequest',
  [ReportingServiceAccessRequestType.DnsRequest]: 'events.rules.dnsRequest',
  [ReportingServiceAccessRequestType.SniRequest]: 'events.rules.sniRequest',
}

export const TABLE_SORT_TO_EVENTS_QUERY_SORT_ORDER = {
  [TableSortDirection.Asc]: ReportingServiceSortDirection.Asc,
  [TableSortDirection.Desc]: ReportingServiceSortDirection.Desc,
}

export const EVENTS_QUERY_SORT_TO_TABLE_SORT_ORDER = {
  [ReportingServiceSortDirection.Asc]: TableSortDirection.Asc,
  [ReportingServiceSortDirection.Desc]: TableSortDirection.Desc,
}

export const EVENTS_GROUP_BY_LOCALIZATION_KEYS = {
  [Types.EventsGroupByParam.Default]: 'events.groupByDefault',
  [Types.EventsGroupByParam.Destination]: 'events.groupByDestination',
  [Types.EventsGroupByParam.Users]: 'events.groupByUsers',
}

export const FIELD_COUNTS_COLUMNS_URL_SEARCH_PARAMS_RESOLVERS = {
  [ReportingServiceField.AppDest]: rowData => ({ [ReportingServiceFilter.Destination]: rowData.key }),
  [ReportingServiceField.EcoId]: rowData => ({ displayName: rowData.metadata?.userInfo?.displayName }),
}

export const DEFAULT_QUERY_VARIABLES: Partial<ReportingServiceQueryVariables> = {
  maxRecords: EVENTS_QUERY_MAX_RECORDS,
  filter: {},
  sort: [{ field: ReportingServiceField.TsStart, order: ReportingServiceSortDirection.Desc }],
}

export const DEFAULT_AGGREGATED_QUERY_VARIABLES: Partial<ReportingServiceQueryVariables> = {
  maxRecords: EVENTS_QUERY_MAX_RECORDS,
  filter: {},
  sort: [{ bucketOrder: ReportingServiceBucketField.MaxTsTerm, order: ReportingServiceSortDirection.Desc }],
}

export const FILTER_OPERATOR_TO_FIELD_MATCH = {
  // HACK: since we don't have official support for "does not contain", we will work
  // around this by using not of 'contains'. This is done in getFieldMatchFilter
  [OPERATOR_VALUES.DOES_NOT_CONTAIN]: ReportingServiceMatch.Contains,
  [OPERATOR_VALUES.CONTAINS]: ReportingServiceMatch.Contains,
  [OPERATOR_VALUES.ENDS_WITH]: ReportingServiceMatch.EndsWith,
  [OPERATOR_VALUES.EQUAL]: ReportingServiceMatch.Equals,
  [OPERATOR_VALUES.STARTS_WITH]: ReportingServiceMatch.StartsWith,
}

const getFieldMatchFilter = (filter: ReportingServiceFilter, activeFilter: EventsTableFilter): ReportingServiceQueryFilters => {
  const queryFilter = {
    [filter]: {
      str: activeFilter?.value,
      match: FILTER_OPERATOR_TO_FIELD_MATCH[activeFilter?.operator],
    },
  }

  return activeFilter?.operator === OPERATOR_VALUES.DOES_NOT_CONTAIN
    ? { [ReportingServiceFilterOperator.Not]: queryFilter }
    : queryFilter
}
