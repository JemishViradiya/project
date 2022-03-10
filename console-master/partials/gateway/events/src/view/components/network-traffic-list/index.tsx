//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useCallback, useRef, useState } from 'react'

import type { XGridProps as MuiXGridProps } from '@material-ui/x-grid'

import type { ReportingServiceTunnelEvent } from '@ues-data/gateway'
import { Data, Hooks } from '@ues-gateway/shared'
import { useDrawer } from '@ues/behaviours'

import EventsInfiniteTable from '../events-infinite-table'
import { useDataLayer, useDefaultFilters, useDefaultSort } from '../hooks'
import type { NetworkTrafficListProps } from '../types'
import { EventsColumnDataKey, EventsListName } from '../types'
import { useColumns } from './columns'
import { NetworkTrafficListDrawer } from './drawer'

const { queryEventsNetworkTraffic } = Data
const { useBigPermissions, BigService } = Hooks

const PICK_COLUMNS = [
  EventsColumnDataKey.Anomaly,
  EventsColumnDataKey.RiskScore,
  EventsColumnDataKey.User,
  EventsColumnDataKey.Platform,
  EventsColumnDataKey.Model,
  EventsColumnDataKey.SourceIp,
  EventsColumnDataKey.Destination,
  EventsColumnDataKey.DestinationPort,
  EventsColumnDataKey.AppProtocol,
  EventsColumnDataKey.Category,
  EventsColumnDataKey.Action,
  EventsColumnDataKey.PolicyName,
  EventsColumnDataKey.RuleNames,
  EventsColumnDataKey.TlsVersion,
  EventsColumnDataKey.TransferredTotal,
  EventsColumnDataKey.Duration,
  EventsColumnDataKey.NetworkRoute,
  EventsColumnDataKey.DateRange,
]
const LIST_NAME = EventsListName.NetworkTraffic

const NetworkTrafficList: React.FC<NetworkTrafficListProps> = ({
  defaultQueryVariables,
  showGroupBy,
  tableTitle,
  hiddenColumns,
  persistDefaultQueryFilter,
}) => {
  useBigPermissions(BigService.Reporting)

  const { data, loading, triggerQuery, queryVariables } = useDataLayer(queryEventsNetworkTraffic, defaultQueryVariables, LIST_NAME)

  const defaultFilters = useDefaultFilters(PICK_COLUMNS, queryVariables)
  const defaultSort = useDefaultSort(queryVariables)
  const columns = useColumns({
    pickColumns: PICK_COLUMNS,
    defaultQueryVariables: queryVariables,
    hiddenColumns,
    listName: LIST_NAME,
  })

  const [networkEvent, setNetworkEvent] = useState<ReportingServiceTunnelEvent>(null)

  const onDrawerClose = useCallback(() => setNetworkEvent(null), [])
  const { open: isOpen, toggleDrawer, onClickAway } = useDrawer(onDrawerClose)

  const rowClickEvent = useRef(null)

  const onRowClick: MuiXGridProps['onRowClick'] = (params, event) => {
    rowClickEvent.current = event.nativeEvent

    if ((networkEvent && params.id === networkEvent.flowId) || !isOpen) {
      toggleDrawer(params.api?.windowRef?.current)
    }

    if (params.id !== networkEvent?.flowId) {
      setNetworkEvent(params.row)
    }
  }

  // Try to generate a random id which includes the start time, flowid and either the dnsId or destination port
  const idFunction = rowData => `${rowData.tsStart}_${rowData.flowId}_${rowData?.dnsId ?? rowData?.destinationPort}`

  return (
    <>
      <EventsInfiniteTable
        columns={columns}
        data={data?.tenant?.tunnelEvents?.events ?? []}
        dataLimit={data?.tenant?.tunnelEvents?.eventsLimit}
        dataTotal={data?.tenant?.tunnelEvents?.totalHits}
        defaultFilters={defaultFilters}
        defaultQueryVariables={queryVariables}
        defaultSort={defaultSort}
        idFunction={idFunction}
        listName={LIST_NAME}
        loading={loading}
        onRowClick={onRowClick}
        pickColumns={PICK_COLUMNS}
        refetch={variables => triggerQuery({ variables })}
        showGroupBy={showGroupBy}
        tableTitle={tableTitle}
        persistDefaultQueryFilter={persistDefaultQueryFilter}
      />
      <NetworkTrafficListDrawer networkEvent={networkEvent} isOpen={isOpen} toggleDrawer={toggleDrawer} onClickAway={onClickAway} />
    </>
  )
}

export default NetworkTrafficList
