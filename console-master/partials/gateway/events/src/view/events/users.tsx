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
import { EventsContextProvider } from '../context'

const UsersEvents: React.FC = () => {
  const { tenantId } = useUesSession()

  return (
    <EventsContextProvider>
      <NetworkTrafficListContainer>
        <AggregatedNetworkTrafficList
          defaultQueryVariables={{ tenantId, field: ReportingServiceField.EcoId, ...DEFAULT_AGGREGATED_QUERY_VARIABLES }}
          hiddenColumns={[EventsColumnDataKey.Destination, EventsColumnDataKey.UsersCount]}
          showGroupBy
        />
      </NetworkTrafficListContainer>
    </EventsContextProvider>
  )
}

export default UsersEvents
