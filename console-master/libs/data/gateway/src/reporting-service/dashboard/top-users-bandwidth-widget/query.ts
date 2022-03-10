//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

export const queryTopUsersBandwidthGql = gql`
  query queryTopUsersBandwidth($maxRecords: Int!, $tenantId: String!, $fromDate: String!, $toDate: String!) {
    tenant(tenantId: $tenantId) {
      public: tunnelAgg(
        field: EcoId
        filter: { tsStart: { from: $fromDate, to: $toDate }, networkRoute: "public" }
        sort: [{ bucketOrder: BytesTotal, order: DESC }]
        fromRecord: 0
        maxRecords: $maxRecords
      ) {
        buckets {
          key
          traffic {
            bytes_total
          }
        }
        userInfo {
          ecoId
          displayName
        }
      }
      private: tunnelAgg(
        field: EcoId
        filter: { tsStart: { from: $fromDate, to: $toDate }, networkRoute: "private" }
        sort: [{ bucketOrder: BytesTotal, order: DESC }]
        fromRecord: 0
        maxRecords: $maxRecords
      ) {
        buckets {
          key
          traffic {
            bytes_total
          }
        }
        userInfo {
          ecoId
          displayName
        }
      }
      all: tunnelAgg(
        field: EcoId
        filter: { tsStart: { from: $fromDate, to: $toDate }, or: [{ networkRoute: "private" }, { networkRoute: "public" }] }
        sort: [{ bucketOrder: BytesTotal, order: DESC }]
        fromRecord: 0
        maxRecords: $maxRecords
      ) {
        buckets {
          key
          traffic {
            bytes_total
          }
        }
        userInfo {
          ecoId
          displayName
        }
      }
    }
  }
`
