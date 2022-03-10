//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

// POST Dashboard/TotalFilesAnalyzed <empty>

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

const getTotalFilesAnalyzedGql = gql`
  query GeTotalFilesAnalyzed {
    analyzedFiles @rest(type: "TotalFilesAnalyzed", path: "/Dashboard/GetTotalFilesAnalyzed") {
      FileCount: number
    }
  }
`

export interface TotalFilesAnalyzed {
  FileCount: number
}

export const getTotalFilesAnalyzed: ApolloQuery<{ analyzedFiles: TotalFilesAnalyzed }, void> = {
  permissions: NoPermissions,
  query: getTotalFilesAnalyzedGql,
  mockQueryFn: () => ({
    analyzedFiles: {
      FileCount: 1341,
    },
  }),
  context: getApolloQueryContext(APOLLO_DESTINATION.VENUE_API),
}
