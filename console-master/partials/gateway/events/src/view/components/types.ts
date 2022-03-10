//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type moment from 'moment'

import type {
  ReportingServiceBucket,
  ReportingServiceField,
  ReportingServiceFieldCount,
  ReportingServiceQueryVariables,
  ReportingServiceUserInfo,
} from '@ues-data/gateway'
import type { OPERATOR_VALUES, TableColumn, TableSortDirection } from '@ues/behaviours'

export enum EventsColumnDataKey {
  Action = 'action',
  AllowedCount = 'allowed-count',
  Anomaly = 'anomaly',
  AppProtocol = 'app-protocol',
  BlockedCount = 'blocked-count',
  Category = 'category',
  ConnectionsCount = 'connections-count',
  DateRange = 'date-range',
  Destination = 'destination',
  Duration = 'duration',
  Model = 'model',
  NetworkRoute = 'network-route',
  Platform = 'platform',
  PolicyName = 'policy-name',
  RiskScore = 'risk-score',
  RuleNames = 'rule-names',
  SourceIp = 'source-ip',
  TlsVersion = 'tls-version',
  TransferredTotal = 'transferred-total',
  User = 'user',
  UsersCount = 'users-count',
  DestinationPort = 'destination-port',
}

export enum EventsListName {
  AggregatedNetworkTraffic = 'aggregated-network-traffic',
  NetworkTraffic = 'network-traffic',
}

export interface CurrentTableData {
  filters?: Partial<
    Record<
      EventsColumnDataKey,
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any
        operator?: OPERATOR_VALUES
      }
    >
  >
  sort?: {
    sortBy: EventsColumnDataKey
    sortDirection: TableSortDirection
  }
}

export type UseColumnsFn<TRowData> = (args: {
  pickColumns: EventsColumnDataKey[]
  defaultQueryVariables?: ReportingServiceQueryVariables
  hiddenColumns?: EventsColumnDataKey[]
  listName: EventsListName
}) => TableColumn<TRowData>[]

export type UseAsyncFilterFn<TReturnValue extends unknown> = (args: {
  activeFilter: {
    value: string
    operator: OPERATOR_VALUES
  }
  refetchEvents: () => void
}) => { value: TReturnValue; loading: boolean }

export interface NetworkTrafficListProps {
  defaultQueryVariables?: ReportingServiceQueryVariables
  showGroupBy?: boolean
  tableTitle?: string
  hiddenColumns?: EventsColumnDataKey[]
  persistDefaultQueryFilter?: boolean
}

export interface EnhancedReportingServiceBucket extends ReportingServiceBucket {
  field?: ReportingServiceField
  metadata?: {
    userInfo?: ReportingServiceUserInfo
    fieldCounts?: Partial<Record<ReportingServiceFieldCount['field'], number>>
  }
}

export interface EventsTableFilter {
  minDatetime?: moment.Moment
  maxDatetime?: moment.Moment
  minDatetimeLabel?: string
  maxDatetimeLabel?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
  operator?: OPERATOR_VALUES
}
