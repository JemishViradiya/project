//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

export const queryTopBlockedCategoriesGql = gql`
  query queryTopBlockedCategories($tenantId: String!, $maxRecords: Int!, $fromDate: String!, $toDate: String!) {
    tenant(tenantId: $tenantId) {
      tunnelAgg(
        fromRecord: 0
        maxRecords: $maxRecords
        field: Category
        filter: { tsStart: { from: $fromDate, to: $toDate } }
        sort: [{ bucketOrder: Count, order: DESC }]
      ) {
        buckets {
          key
          blocked
        }
      }
    }
  }
`
