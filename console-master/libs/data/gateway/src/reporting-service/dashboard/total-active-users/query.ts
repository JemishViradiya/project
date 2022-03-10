//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

export const queryTotalActiveUsersGql = gql`
  query queryTotalActiveUsers($tenantId: String!, $fromDate: String!, $toDate: String!) {
    tenant(tenantId: $tenantId) {
      counters(fromDate: $fromDate, toDate: $toDate) {
        users
      }
    }
  }
`
