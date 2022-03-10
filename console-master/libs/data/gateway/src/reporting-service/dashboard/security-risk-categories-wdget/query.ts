//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

export const querySecurityRiskCategoriesGql = gql`
  query querySecurityRiskCategories($tenantId: String!, $maxRecords: Int!, $fromDate: String!, $toDate: String!) {
    tenant(tenantId: $tenantId) {
      tunnelAgg(
        fromRecord: 0
        maxRecords: $maxRecords
        field: SubCategory
        filter: { tsStart: { from: $fromDate, to: $toDate }, category: 900 }
        sort: [{ bucketOrder: Count, order: DESC }]
      ) {
        buckets {
          key
          count
          blocked
          allowed
        }
      }
    }
  }
`
