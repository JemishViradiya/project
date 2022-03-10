//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

export const queryTopNetworkDestinationsGql = gql`
  query queryTopNetworkDestinations(
    $tenantId: String!
    $maxRecords: Int!
    $fromDate: String!
    $toDate: String!
    $filter: Filter!
    $sort: [SortBucket]
  ) {
    tenant(tenantId: $tenantId) {
      tunnelAgg(
        fromRecord: 0
        maxRecords: $maxRecords
        field: AppDest
        fieldCounters: [EcoId]
        filter: { and: [{ tsStart: { from: $fromDate, to: $toDate } }, $filter] }
        sort: $sort
      ) {
        buckets {
          key
          count
          traffic {
            bytes_total
          }
          fieldCounts {
            field
            count
          }
        }
      }
    }
  }
`
