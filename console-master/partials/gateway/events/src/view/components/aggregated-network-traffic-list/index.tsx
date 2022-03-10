//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useMemo } from 'react'

import type { ReportingServiceUserInfo } from '@ues-data/gateway'
import { Data, Hooks } from '@ues-gateway/shared'

import EventsInfiniteTable from '../events-infinite-table'
import { useDataLayer, useDefaultFilters, useDefaultSort } from '../hooks'
import type { NetworkTrafficListProps } from '../types'
import { EventsColumnDataKey, EventsListName } from '../types'
import { useColumns } from './columns'

const { queryAggregatedNetworkTraffic } = Data
const { useBigPermissions, BigService } = Hooks

const PICK_COLUMNS = [
  EventsColumnDataKey.User,
  EventsColumnDataKey.Destination,
  EventsColumnDataKey.ConnectionsCount,
  EventsColumnDataKey.AllowedCount,
  EventsColumnDataKey.BlockedCount,
  EventsColumnDataKey.UsersCount,
  EventsColumnDataKey.TransferredTotal,
  EventsColumnDataKey.DateRange,
]
const LIST_NAME = EventsListName.AggregatedNetworkTraffic

const AggregatedNetworkTrafficList: React.FC<NetworkTrafficListProps> = ({
  defaultQueryVariables,
  showGroupBy,
  tableTitle,
  hiddenColumns,
}) => {
  useBigPermissions(BigService.Reporting)

  const { data, loading, triggerQuery, queryVariables } = useDataLayer(
    queryAggregatedNetworkTraffic,
    defaultQueryVariables,
    LIST_NAME,
  )

  const aggregatedNetworkTraffic = useMemo(() => {
    const aggregatedNetworkUsersInfo = (data?.tenant?.tunnelAgg?.userInfo ?? [])?.reduce<Record<string, ReportingServiceUserInfo>>(
      (acc, item) => ({ ...acc, [item.ecoId]: { ...item } }),
      {},
    )

    return (data?.tenant?.tunnelAgg?.buckets ?? []).map(bucket => ({
      ...bucket,
      field: defaultQueryVariables.field,
      metadata: {
        userInfo: aggregatedNetworkUsersInfo?.[bucket.key],
        fieldCounts: bucket.fieldCounts?.reduce((acc, { field, count }) => ({ ...acc, [field]: count }), {}),
      },
    }))
  }, [data, defaultQueryVariables.field])

  const defaultFilters = useDefaultFilters(PICK_COLUMNS, queryVariables)
  const defaultSort = useDefaultSort(queryVariables)
  const columns = useColumns({ pickColumns: PICK_COLUMNS, listName: LIST_NAME, hiddenColumns })

  return (
    <EventsInfiniteTable
      columns={columns}
      data={aggregatedNetworkTraffic}
      dataLimit={data?.tenant?.tunnelAgg?.aggLimit}
      dataTotal={data?.tenant?.tunnelAgg?.totalHits}
      defaultFilters={defaultFilters}
      defaultQueryVariables={queryVariables}
      defaultSort={defaultSort}
      idFunction={rowData => rowData.key}
      listName={LIST_NAME}
      loading={loading}
      pickColumns={PICK_COLUMNS}
      refetch={variables => triggerQuery({ variables })}
      showGroupBy={showGroupBy}
      tableTitle={tableTitle}
    />
  )
}

export default AggregatedNetworkTrafficList
