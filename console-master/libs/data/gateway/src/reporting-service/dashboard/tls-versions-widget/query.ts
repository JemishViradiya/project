// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

export const queryTLSVersionsGql = gql`
  query queryTLSVersions($tenantId: String!, $maxRecords: Int!, $fromDate: String!, $toDate: String!, $filter: Filter!) {
    tenant(tenantId: $tenantId) {
      tunnelAgg(
        fromRecord: 0
        maxRecords: $maxRecords
        field: TlsVersion
        filter: { and: [{ tsStart: { from: $fromDate, to: $toDate } }, $filter] }
        sort: [{ bucketOrder: Count, order: DESC }]
      ) {
        buckets {
          key
          count
        }
      }
    }
  }
`
