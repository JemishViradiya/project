import { gql } from '@apollo/client'

export const UserInfoListColumnsDataKey = 'userInfoListColumns'
export const UserInfoListColumnsUpdateKey = 'updateUserInfoListColumns'

export const UserInfoListColumnsQuery = {
  displayName: 'UserInfoListColumnsQuery',
  query: gql`
    query ${UserInfoListColumnsDataKey} {
      ${UserInfoListColumnsDataKey} @client {
        columns
      }
    }
  `,
  // don't provide "mockQueryFn" intentionally, we can turn it on when we start using this query
}

export const UserInfoListColumnsUpdateMutation = {
  displayName: 'UserInfoListColumnsUpdateMutation',
  mutation: gql`
    mutation ${UserInfoListColumnsUpdateKey}($columns: Array) {
      ${UserInfoListColumnsUpdateKey}(columns: $columns) @client {
        columns
      }
    }
  `,
  // don't provide "mockQueryFn" intentionally, we can turn it on when we start using this mutation
}
