//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Icon, Link, Typography } from '@material-ui/core'

import type { ReportingServiceTunnelEvent } from '@ues-data/gateway'
import { ReportingServiceAlertAction, ReportingServiceField, ReportingServiceFilter, TlsVersions } from '@ues-data/gateway'
import { FeatureName, useFeatures } from '@ues-data/shared'
import type { Types } from '@ues-gateway/shared'
import { Config, Hooks, Utils } from '@ues-gateway/shared'
import { StatusMedium } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import { FILTER_TYPES } from '@ues/behaviours'

import { EventsContext } from '../../context'
import {
  ACCESS_REQUEST_TYPE_KEYS,
  ACTION_LOCALIZATION_KEYS,
  FIELD_COUNTS_COLUMNS_URL_SEARCH_PARAMS_RESOLVERS,
  NETWORK_ROUTE_LOCALIZATION_KEYS,
} from '../constants'
import {
  ActionFilterComponent,
  AnomalyFilterComponent,
  AppliedRuleFilterComponent,
  AppProtocolFilterComponent,
  CategoryFilterComponent,
  DateRangeFilterComponent,
  DestinationFilterComponent,
  DestinationPortFilterComponent,
  NetworkRouteFilterComponent,
  SourceIpFilterComponent,
  TlsVersionFilterComponent,
  TransferredTotalFilterComponent,
  UserFilterComponent,
} from '../filters'
import type { EnhancedReportingServiceBucket } from '../types'
import { EventsColumnDataKey, EventsListName } from '../types'
import { useEventsNavigate } from './use-events-navigate'

const { useBytesFormatterResolver } = Hooks

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { checkIsAnomaly, checkIsDNS, computeDuration, resolveTunnelEventTransfer, encodeId, formatTimestamp, getRiskScore } = Utils

const CELL_MIN_WIDTH = 100

type UseColumnsDefinitionFn = <TRowData>(args?: {
  hiddenColumns?: EventsColumnDataKey[]
  listName: EventsListName
  overwriteColumns?: Partial<Record<EventsColumnDataKey, Partial<TableColumn<TRowData>>>>
  pickColumns: EventsColumnDataKey[]
}) => TableColumn<TRowData>[]

interface LinkCellProps {
  label: string | number
  routeParams: { queryStringParams?: Types.GatewayEventsRouteQueryParams; ecoId?: string }
}

interface CategoryCellProps {
  category: number
  subCategory: number
}

const DestinationUserLinkCell: React.FC<LinkCellProps> = ({ label, routeParams: { queryStringParams } }) => {
  const eventsNavigate = useEventsNavigate()

  return (
    <Link variant="inherit" color="primary" onClick={() => eventsNavigate(queryStringParams)}>
      {label}
    </Link>
  )
}

const ExternalUserLinkCell: React.FC<LinkCellProps> = ({ label, routeParams: { ecoId } }) =>
  !isEmpty(ecoId) && (
    <Link
      variant="inherit"
      color="primary"
      href={`/uc/platform#/users/${encodeId(ecoId)}/events/gateway-events`}
      onClick={(event: React.SyntheticEvent) => event.stopPropagation()}
    >
      {label}
    </Link>
  )

const CategoryCell: React.FC<CategoryCellProps> = ({ category, subCategory }) => {
  const {
    categories: { categoryIdsMap },
  } = useContext(EventsContext)

  return (
    !!category && (
      <Box display="flex" flexDirection="column">
        <Typography variant="subtitle2">{categoryIdsMap[category]}</Typography>
        <Typography>{categoryIdsMap[subCategory]}</Typography>
      </Box>
    )
  )
}

export const useColumnsDefinition: UseColumnsDefinitionFn = ({ listName, pickColumns, hiddenColumns, overwriteColumns = {} }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const bytesFormatterResolver = useBytesFormatterResolver()
  const features = useFeatures()
  const aclEnabled = features.isEnabled(FeatureName.UESBigAclEnabled)

  const columnsOverwrites = {
    [EventsListName.AggregatedNetworkTraffic]: {
      [EventsColumnDataKey.Destination]: {
        renderCell: (rowData: EnhancedReportingServiceBucket) => rowData.key,
      },

      [EventsColumnDataKey.User]: {
        renderCell: (rowData: EnhancedReportingServiceBucket) => {
          const userInfo = rowData.metadata?.userInfo

          return <ExternalUserLinkCell label={userInfo?.displayName} routeParams={{ ecoId: userInfo?.ecoId }} />
        },
      },

      [EventsColumnDataKey.DateRange]: {
        label: t('events.lastActivity'),
        renderCell: (rowData: EnhancedReportingServiceBucket) => formatTimestamp(rowData.maxTsTerm),
      },

      [EventsColumnDataKey.ConnectionsCount]: {
        renderCell: (rowData: EnhancedReportingServiceBucket) => (
          <DestinationUserLinkCell
            label={rowData?.count}
            routeParams={{ queryStringParams: FIELD_COUNTS_COLUMNS_URL_SEARCH_PARAMS_RESOLVERS[rowData.field](rowData) }}
          />
        ),
      },

      [EventsColumnDataKey.BlockedCount]: {
        renderCell: (rowData: EnhancedReportingServiceBucket) => (
          <DestinationUserLinkCell
            label={rowData?.blocked}
            routeParams={{
              queryStringParams: {
                ...FIELD_COUNTS_COLUMNS_URL_SEARCH_PARAMS_RESOLVERS[rowData.field](rowData),
                [ReportingServiceFilter.AlertAction]: ReportingServiceAlertAction.Blocked,
              },
            }}
          />
        ),
      },

      [EventsColumnDataKey.AllowedCount]: {
        renderCell: (rowData: EnhancedReportingServiceBucket) => (
          <DestinationUserLinkCell
            label={rowData?.allowed}
            routeParams={{
              queryStringParams: {
                ...FIELD_COUNTS_COLUMNS_URL_SEARCH_PARAMS_RESOLVERS[rowData.field](rowData),
                [ReportingServiceFilter.AlertAction]: ReportingServiceAlertAction.Allowed,
              },
            }}
          />
        ),
      },

      [EventsColumnDataKey.TransferredTotal]: {
        renderCell: (rowData: EnhancedReportingServiceBucket) => bytesFormatterResolver(rowData.traffic.bytes_total),
      },

      ...overwriteColumns,
    },

    [EventsListName.NetworkTraffic]: {
      [EventsColumnDataKey.TransferredTotal]: {
        renderCell: (rowData: ReportingServiceTunnelEvent) =>
          checkIsDNS(rowData) ? '-' : resolveTunnelEventTransfer(rowData, t, bytesFormatterResolver),
      },
      [EventsColumnDataKey.Destination]: {
        renderCell: (rowData: ReportingServiceTunnelEvent) => {
          const { appName, destinationFqdn, destinationIp, rrName } = rowData
          const title = !isEmpty(appName) ? appName : !isEmpty(destinationFqdn) ? destinationFqdn : destinationIp
          const isDNS = checkIsDNS(rowData)

          return (
            <Box display="flex" flexDirection="column">
              {isDNS ? (
                <>
                  {!isEmpty(appName) && <Typography>{appName}</Typography>}
                  <Typography>{rrName}</Typography>
                </>
              ) : (
                <>
                  <Typography>{title}</Typography>
                  {title !== destinationIp && <Typography variant="caption">{destinationIp}</Typography>}
                </>
              )}
            </Box>
          )
        },
        width: 250,
      },
      [EventsColumnDataKey.User]: {
        sortable: false,
        renderCell: (rowData: ReportingServiceTunnelEvent) => (
          <ExternalUserLinkCell label={rowData?.displayName} routeParams={{ ecoId: rowData?.ecoId }} />
        ),
      },
      [EventsColumnDataKey.DateRange]: {
        label: t('common.startTime'),
        renderCell: (rowData: ReportingServiceTunnelEvent) => formatTimestamp(rowData.tsStart),
      },
      ...overwriteColumns,
    },
  }

  const columnsDefinition = {
    [EventsColumnDataKey.User]: {
      dataKey: EventsColumnDataKey.User,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      label: t('common.user'),
      persistent: true,
      renderFilter: () => <UserFilterComponent />,
      sortable: false,
      gridColDefProps: { flex: 1.5, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.TransferredTotal]: {
      dataKey: EventsColumnDataKey.TransferredTotal,
      filterType: FILTER_TYPES.NUMERIC,
      label: t('common.transferred'),
      renderFilter: () => <TransferredTotalFilterComponent />,
      sortable: true,
      gridColDefProps: { flex: 1, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.DateRange]: {
      dataKey: EventsColumnDataKey.DateRange,
      filterType: FILTER_TYPES.DATETIME_RANGE,
      renderFilter: () => <DateRangeFilterComponent />,
      sortable: true,
      gridColDefProps: { flex: 1.25, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.Destination]: {
      dataKey: EventsColumnDataKey.Destination,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      label: t('common.destination'),
      persistent: true,
      renderFilter: () => <DestinationFilterComponent />,
      sortable: true,
      gridColDefProps: { flex: 1.5, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.DestinationPort]: {
      dataKey: EventsColumnDataKey.DestinationPort,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      gridColDefProps: { flex: 1, minWidth: CELL_MIN_WIDTH },
      label: t('events.destinationPort'),
      renderCell: (rowData: ReportingServiceTunnelEvent) => rowData?.destinationPort,
      renderFilter: () => <DestinationPortFilterComponent />,
      sortable: true,
      text: true,
    },
    [EventsColumnDataKey.ConnectionsCount]: {
      dataKey: EventsColumnDataKey.ConnectionsCount,
      label: t('common.connections'),
      persistent: true,
      sortable: true,
      gridColDefProps: { flex: 1, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.AllowedCount]: {
      dataKey: EventsColumnDataKey.AllowedCount,
      label: t('common.allowed'),
      gridColDefProps: { flex: 1, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.BlockedCount]: {
      dataKey: EventsColumnDataKey.BlockedCount,
      label: t('common.blocked'),
      gridColDefProps: { flex: 1, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.UsersCount]: {
      dataKey: EventsColumnDataKey.UsersCount,
      label: t('events.users'),
      renderCell: (rowData: EnhancedReportingServiceBucket) => rowData?.metadata?.fieldCounts?.[ReportingServiceField.EcoId],
      gridColDefProps: { flex: 1, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.Platform]: {
      dataKey: EventsColumnDataKey.Platform,
      label: t('common.platform'),
      renderCell: (rowData: ReportingServiceTunnelEvent) => rowData.deviceInfo?.platform,
      sortable: true,
      gridColDefProps: { flex: 0.5, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.Model]: {
      dataKey: EventsColumnDataKey.Model,
      label: t('common.model'),
      renderCell: (rowData: ReportingServiceTunnelEvent) => rowData.deviceInfo?.deviceModelName,
      show: false,
      sortable: true,
      gridColDefProps: { flex: 1, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.SourceIp]: {
      dataKey: EventsColumnDataKey.SourceIp,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      label: t('common.source'),
      renderCell: (rowData: ReportingServiceTunnelEvent) => rowData.sourceIp,
      renderFilter: () => <SourceIpFilterComponent />,
      show: false,
      sortable: true,
      gridColDefProps: { flex: 1, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.Action]: {
      dataKey: EventsColumnDataKey.Action,
      filterType: FILTER_TYPES.RADIO,
      label: t('common.action'),
      persistent: true,
      renderCell: (rowData: ReportingServiceTunnelEvent) => rowData.action && t(ACTION_LOCALIZATION_KEYS[rowData.action]),
      renderFilter: () => <ActionFilterComponent />,
      sortable: true,
      gridColDefProps: { flex: 0.9, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.NetworkRoute]: {
      dataKey: EventsColumnDataKey.NetworkRoute,
      filterType: FILTER_TYPES.RADIO,
      label: t('events.networkRoute'),
      renderCell: (rowData: ReportingServiceTunnelEvent) =>
        rowData.networkRoute && t(NETWORK_ROUTE_LOCALIZATION_KEYS[rowData.networkRoute]),
      renderFilter: () => <NetworkRouteFilterComponent />,
      show: false,
      sortable: true,
      gridColDefProps: { flex: 1, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.PolicyName]: {
      dataKey: EventsColumnDataKey.PolicyName,
      label: t('events.policyName'),
      renderCell: (rowData: ReportingServiceTunnelEvent) => rowData.policyName,
      show: !aclEnabled,
      sortable: true,
      gridColDefProps: { flex: 2, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.RuleNames]: {
      dataKey: EventsColumnDataKey.RuleNames,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      label: t('events.appliedRules'),
      renderCell: (rowData: ReportingServiceTunnelEvent) => (
        <Box display="flex" flexDirection="column">
          {rowData?.rules?.map(item => (
            <Box display="flex" flexDirection="row">
              {item?.requestType && (
                <Box mr={2}>
                  <Typography variant="subtitle2">{t(ACCESS_REQUEST_TYPE_KEYS[item.requestType])}</Typography>
                </Box>
              )}
              {item?.ruleName && <Typography>{item?.ruleName}</Typography>}
            </Box>
          ))}
        </Box>
      ),
      renderFilter: () => <AppliedRuleFilterComponent />,
      show: aclEnabled,
      sortable: true,
      hidden: !aclEnabled,
      gridColDefProps: { flex: 2, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.TlsVersion]: {
      dataKey: EventsColumnDataKey.TlsVersion,
      filterType: FILTER_TYPES.RADIO,
      label: t('events.tls.version'),
      renderCell: (rowData: ReportingServiceTunnelEvent) =>
        rowData.version === TlsVersions.UNDETERMINED ? t('events.unknown') : rowData.version,
      renderFilter: () => <TlsVersionFilterComponent />,
      sortable: true,
      gridColDefProps: { flex: 1, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.Duration]: {
      dataKey: EventsColumnDataKey.Duration,
      label: t('events.duration'),
      renderCell: (rowData: ReportingServiceTunnelEvent) => computeDuration(rowData, t),
      show: false,
      gridColDefProps: { flex: 1, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.Anomaly]: {
      dataKey: EventsColumnDataKey.Anomaly,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      label: t('events.anomaly'),
      renderCell: (rowData: ReportingServiceTunnelEvent) =>
        checkIsAnomaly(rowData) ? <Icon component={StatusMedium} /> : undefined,
      renderFilter: () => <AnomalyFilterComponent />,
      gridColDefProps: { flex: 0.9, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.RiskScore]: {
      dataKey: EventsColumnDataKey.RiskScore,
      label: t('events.riskScore'),
      renderCell: (rowData: ReportingServiceTunnelEvent) => getRiskScore(rowData),
      sortable: true,
      gridColDefProps: { flex: 0.75, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.AppProtocol]: {
      dataKey: EventsColumnDataKey.AppProtocol,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      label: t('events.appProtocol'),
      renderCell: (rowData: ReportingServiceTunnelEvent) => rowData.appProto,
      renderFilter: () => <AppProtocolFilterComponent />,
      show: false,
      sortable: true,
      gridColDefProps: { flex: 0.75, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
    [EventsColumnDataKey.Category]: {
      dataKey: EventsColumnDataKey.Category,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      label: t('events.eventAlerts.category'),
      renderCell: (rowData: ReportingServiceTunnelEvent) => {
        const { category, subCategory } = rowData
        return <CategoryCell category={category} subCategory={subCategory} />
      },
      renderFilter: () => <CategoryFilterComponent />,
      show: false,
      sortable: true,
      hidden: !aclEnabled,
      gridColDefProps: { flex: 1, minWidth: CELL_MIN_WIDTH },
      text: true,
    },
  }

  return pickColumns.reduce((accumulator, columnDataKey) => {
    const columnDefinition = columnsDefinition[columnDataKey]

    if (!isEmpty(hiddenColumns) && hiddenColumns.includes(columnDefinition.dataKey)) return accumulator

    const column = {
      ...columnDefinition,
      ...(columnsOverwrites?.[listName]?.[columnDefinition.dataKey] ?? {}),
    }

    return [...accumulator, column]
  }, [])
}
