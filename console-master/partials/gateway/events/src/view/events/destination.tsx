//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import { ReportingServiceField } from '@ues-data/gateway'
import { useUesSession } from '@ues-data/shared'

import {
  AggregatedNetworkTrafficList,
  DEFAULT_AGGREGATED_QUERY_VARIABLES,
  EventsColumnDataKey,
  NetworkTrafficListContainer,
} from '../components'

const DestinationEvents: React.FC = () => {
  const { tenantId } = useUesSession()

  return (
    <NetworkTrafficListContainer>
      <AggregatedNetworkTrafficList
        defaultQueryVariables={{
          tenantId,
          field: ReportingServiceField.AppDest,
          fieldCounters: [ReportingServiceField.EcoId],
          ...DEFAULT_AGGREGATED_QUERY_VARIABLES,
        }}
        hiddenColumns={[EventsColumnDataKey.User]}
        showGroupBy
      />
    </NetworkTrafficListContainer>
  )
}

export default DestinationEvents
