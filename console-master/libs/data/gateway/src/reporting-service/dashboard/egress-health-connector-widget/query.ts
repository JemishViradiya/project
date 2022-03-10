//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

export const queryEgressHealthConnectorGql = gql`
  query queryEgressHealthConnector($tenantId: String!, $fromDate: String!, $toDate: String!, $connectors: [String!]) {
    tenant(tenantId: $tenantId) {
      conStates(fromDate: $fromDate, toDate: $toDate, connectors: $connectors) {
        id
        name
        states {
          state
          errType
          startTimeStamp
          endTimeStamp
        }
      }
    }
  }
`
