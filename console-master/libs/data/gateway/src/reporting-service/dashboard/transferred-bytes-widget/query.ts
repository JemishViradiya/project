//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

export const queryTransferredBytesGql = gql`
  query queryTransferredBytes($tenantId: String!, $fromDate: String!, $toDate: String!) {
    tenant(tenantId: $tenantId) {
      traffic(fromDate: $fromDate, toDate: $toDate) {
        bytes_toserver
        bytes_toclient
      }
    }
  }
`
