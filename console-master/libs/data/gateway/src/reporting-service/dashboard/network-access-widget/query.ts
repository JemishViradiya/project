// //******************************************************************************
// // Copyright 2021 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

export const queryNetworkAccessTrafficSummaryGql = gql`
  query queryNetworkAccessTraffic(
    $tenantId: String!
    $interval: TimeInterval!
    $fromDate: String!
    $toDate: String!
    $filter: Filter!
  ) {
    tenant(tenantId: $tenantId) {
      tunnelTimeAgg(
        interval: $interval
        filter: { and: [{ tsStart: { from: $fromDate, to: $toDate } }, $filter] }
        fields: [EcoId]
      ) {
        allowed
        blocked
        key
        count
        traffic {
          bytes_toclient
          bytes_toserver
        }
        fieldCounts {
          count
        }
      }
    }
  }
`
