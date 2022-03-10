//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

export const queryAggregatedNetworkTrafficGql = gql`
  query queryAggregatedNetworkTraffic(
    $field: Field!
    $fieldCounters: [Field!]
    $filter: Filter!
    $fromRecord: Int!
    $maxRecords: Int!
    $sort: [SortBucket]
    $tenantId: String!
  ) {
    tenant(tenantId: $tenantId) {
      tunnelAgg(
        field: $field
        fieldCounters: $fieldCounters
        filter: $filter
        fromRecord: $fromRecord
        maxRecords: $maxRecords
        sort: $sort
      ) {
        totalHits
        buckets {
          key
          count
          traffic {
            bytes_toclient
            bytes_toserver
            bytes_total
          }
          fieldCounts {
            field
            count
          }
          allowed
          blocked
          maxTsTerm
        }
        userInfo {
          ecoId
          userName
          displayName
          firstName
          lastName
          email
        }
      }
    }
  }
`
