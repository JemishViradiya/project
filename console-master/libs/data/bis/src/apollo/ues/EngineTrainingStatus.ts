import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, Permission } from '@ues-data/shared'

import { BISEngineTrainingStatusQueryMock } from '../mocks'

export interface TrainingStatus {
  trainingStatus: {
    networkAnomalyDetection: boolean
  }
}

export const BISEngineTrainingStatusQuery: ApolloQuery<TrainingStatus, void> = {
  displayName: 'BISEngineTrainingStatusQuery',
  query: gql`
    query trainingStatus {
      trainingStatus: BIS_trainingStatus {
        networkAnomalyDetection
      }
    }
  `,
  mockQueryFn: () => BISEngineTrainingStatusQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: new Set([Permission.BIS_EVENTS_READ]),
}
