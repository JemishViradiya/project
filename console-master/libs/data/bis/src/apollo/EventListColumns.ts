import { gql } from '@apollo/client'

import { NoPermissions } from '@ues-data/shared'

import { EventListColumnsQueryMock, EventListColumnsUpdateMutationMock } from './mocks'

export const EventListColumnsDataKey = 'eventListColumns'
export const EventListColumnsUpdateKey = 'updateEventListColumns'

export const EventListColumnsQuery = {
  displayName: 'EventListColumnsQuery',
  query: gql`
    query ${EventListColumnsDataKey} {
      ${EventListColumnsDataKey} @client {
        columns
      }
    }
  `,
  mockQueryFn: () => EventListColumnsQueryMock,
  permissions: NoPermissions,
}

export const EventListColumnsUpdateMutation = {
  displayName: 'EventListColumnsUpdateMutation',
  mutation: gql`
    mutation ${EventListColumnsUpdateKey}($columns: Array) {
      ${EventListColumnsUpdateKey}(columns: $columns) @client {
        columns
      }
    }
  `,
  mockMutationFn: () => EventListColumnsUpdateMutationMock,
}
