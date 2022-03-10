import { gql } from '@apollo/client'

import { GeozoneListColumnsQueryMock, GeozoneListColumnsUpdateMutationMock } from './mocks'

export const GeozoneListColumnsDataKey = 'geozoneListColumns'
export const GeozoneListColumnsUpdateKey = 'updateGeozoneListColumns'

export const GeozoneListColumnsQuery = {
  displayName: 'GeozoneListColumnsQuery',
  query: gql`
    query ${GeozoneListColumnsDataKey} {
      ${GeozoneListColumnsDataKey} @client {
        columns
      }
    }
  `,
  mockQueryFn: () => GeozoneListColumnsQueryMock,
}

export const GeozoneListColumnsUpdateMutation = {
  displayName: 'GeozoneListColumnsUpdateMutation',
  mutation: gql`
    mutation ${GeozoneListColumnsUpdateKey}($columns: Array) {
      ${GeozoneListColumnsUpdateKey}(columns: $columns) @client {
        columns
      }
    }
  `,
  mockMutationFn: () => GeozoneListColumnsUpdateMutationMock,
}
