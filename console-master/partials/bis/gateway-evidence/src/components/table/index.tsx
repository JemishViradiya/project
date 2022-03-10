import React, { memo } from 'react'
import { useParams } from 'react-router-dom'

import type { ReportingServiceQueryVariables } from '@ues-data/gateway'
import { ReportingServiceField, ReportingServiceFilter, ReportingServiceSortDirection } from '@ues-data/gateway'
import { useUesSession } from '@ues-data/shared'
import { NetworkTrafficList } from '@ues-gateway/events'
import { Config } from '@ues-gateway/shared'

const { EVENTS_QUERY_MAX_RECORDS } = Config

export const Table: React.FC<{
  tableTitle?: string
}> = memo(({ tableTitle }) => {
  const { id } = useParams()
  const { tenantId } = useUesSession()

  const defaultQueryVariables: ReportingServiceQueryVariables = {
    tenantId,
    maxRecords: EVENTS_QUERY_MAX_RECORDS,
    filter: { [ReportingServiceFilter.DatapointId]: id },
    sort: [{ field: ReportingServiceField.BisScore, order: ReportingServiceSortDirection.Desc }],
  }

  return <NetworkTrafficList defaultQueryVariables={defaultQueryVariables} tableTitle={tableTitle} persistDefaultQueryFilter />
})
