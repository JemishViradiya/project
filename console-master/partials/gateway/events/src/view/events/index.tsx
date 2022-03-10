//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import { useUesSession } from '@ues-data/shared'

import { DEFAULT_QUERY_VARIABLES, NetworkTrafficList, NetworkTrafficListContainer } from '../components'
import { EventsContextProvider } from '../context'

const Events: React.FC = () => {
  const { tenantId } = useUesSession()

  return (
    <EventsContextProvider>
      <NetworkTrafficListContainer>
        <NetworkTrafficList defaultQueryVariables={{ tenantId, ...DEFAULT_QUERY_VARIABLES }} showGroupBy />
      </NetworkTrafficListContainer>
    </EventsContextProvider>
  )
}
export default Events
