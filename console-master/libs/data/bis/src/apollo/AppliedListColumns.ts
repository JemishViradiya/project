import { gql } from '@apollo/client'

import { AppledListColumnsQueryMock, AppliedListColumnsUpdateMutationMock } from './mocks'

export const AppledListColumnsDataKey = 'appliedListColumns'
export const AppledListColumnsUpdateKey = 'updateAppliedListColumns'

export const AppledListColumnsQuery = {
  displayName: 'AppledListColumnsQuery',
  query: gql`
    query {
      ${AppledListColumnsDataKey} @client {
        columns
      }
    }
  `,
  mockQueryFn: () => AppledListColumnsQueryMock,
}

export const AppliedListColumnsUpdateMutation = {
  displayName: 'AppliedListColumnsUpdateMutation',
  mutation: gql`
    mutation ($columns: Array) {
      ${AppledListColumnsUpdateKey}(columns: $columns) @client {
        columns
      }
    }
  `,
  mockMutationFn: () => AppliedListColumnsUpdateMutationMock,
}
