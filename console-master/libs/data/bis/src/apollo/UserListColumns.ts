import { gql } from '@apollo/client'

import { UserListColumnsQueryMock, UserListColumnsUpdateMutationMock } from './mocks'

export const UserListColumnsDataKey = 'userListColumns'
export const UserListColumnsUpdateKey = 'updateUserListColumns'

export const UserListColumnsQuery = {
  displayName: 'UserListColumnsQuery',
  query: gql`
    query ${UserListColumnsDataKey} {
      ${UserListColumnsDataKey} @client {
        columns
      }
    }
  `,
  mockQueryFn: () => UserListColumnsQueryMock,
}

export const UserListColumnsUpdateMutation = {
  displayName: 'UserListColumnsUpdateMutation',
  mutation: gql`
    mutation ${UserListColumnsUpdateKey}($columns: Array) {
      ${UserListColumnsUpdateKey}(columns: $columns) @client {
        columns
      }
    }
  `,
  mockMutationFn: () => UserListColumnsUpdateMutationMock,
}
