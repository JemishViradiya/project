import gql from 'graphql-tag'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { ActionTypesQueryMock } from './mocks'

export const ActionTypesQuery: ApolloQuery<typeof ActionTypesQueryMock, void> = {
  displayName: 'AvailableActionsQuery',
  query: gql`
    query availableActions {
      availableActions: BIS_availableActions {
        actionType
        pillarTypeId
        client {
          userInputs {
            gracePeriod
          }
          needUpdated {
            serviceId
            entityType
          }
        }
      }
    }
  `,
  mockQueryFn: () => ActionTypesQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
