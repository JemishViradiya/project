//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

export const queryNetworkTrafficGql = gql`
  query queryNetworkTraffic($tenantId: String!, $fromDate: String!, $toDate: String!) {
    tenant(tenantId: $tenantId) {
      counters(fromDate: $fromDate, toDate: $toDate) {
        allowed: evCounter(evFilter: { alertAction: ALLOWED })
        blocked: evCounter(evFilter: { alertAction: BLOCKED })
      }
    }
  }
`
