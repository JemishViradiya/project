import { gql } from '@apollo/client'

import { PolicyListColumnsQueryMock, PolicyListColumnsUpdateMutationMock } from './mocks'

export const PolicyListColumnsDataKey = 'policyListColumns'
export const PolicyListColumnsUpdateKey = 'updatePolicyListColumns'

export const PolicyListColumnsQuery = {
  displayName: 'PolicyListColumnsQuery',
  query: gql`
    query ${PolicyListColumnsDataKey} {
      ${PolicyListColumnsDataKey} @client {
        columns
      }
    }
  `,
  mockQueryFn: () => PolicyListColumnsQueryMock,
}

export const PolicyListColumnsUpdateMutation = {
  displayName: 'PolicyListColumnsUpdateMutation',
  mutation: gql`
    mutation ${PolicyListColumnsUpdateKey}($columns: Array) {
      ${PolicyListColumnsUpdateKey}(columns: $columns) @client {
        columns
      }
    }
  `,
  mockMutationFn: () => PolicyListColumnsUpdateMutationMock,
}
