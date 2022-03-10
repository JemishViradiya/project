// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

export const queryAppliedPoliciesGql = gql`
  query queryAppliedPolicies($tenantId: String!, $maxRecords: Int!, $fromDate: String!, $toDate: String!, $filter: Filter!) {
    tenant(tenantId: $tenantId) {
      tunnelAgg(
        fromRecord: 0
        maxRecords: $maxRecords
        field: PolicyName
        filter: { and: [{ tsStart: { from: $fromDate, to: $toDate } }, $filter] }
      ) {
        buckets {
          key
          count
        }
      }
    }
  }
`
