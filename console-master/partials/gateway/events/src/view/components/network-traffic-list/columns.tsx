//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isNil } from 'lodash-es'
import { useMemo } from 'react'

import type { ReportingServiceTunnelEvent } from '@ues-data/gateway'

import { useColumnsDefinition } from '../hooks'
import type { UseColumnsFn } from '../types'
import { EventsColumnDataKey } from '../types'

export const useColumns: UseColumnsFn<ReportingServiceTunnelEvent> = ({
  pickColumns,
  defaultQueryVariables,
  hiddenColumns,
  listName,
}) => {
  const { tlsVersion, datapointId, networkRoute } = defaultQueryVariables?.filter

  const columns = useColumnsDefinition<ReportingServiceTunnelEvent>({
    pickColumns,
    overwriteColumns: {
      [EventsColumnDataKey.RiskScore]: { show: !isNil(datapointId) },
      [EventsColumnDataKey.TlsVersion]: { show: Boolean(tlsVersion) },
      [EventsColumnDataKey.NetworkRoute]: { show: Boolean(networkRoute) },
    },
    listName,
    hiddenColumns,
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => columns, [tlsVersion, datapointId, networkRoute])
}
