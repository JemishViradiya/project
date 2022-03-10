import { gql } from '@apollo/client'

import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import { TimePeriodQueryMock, TimePeriodUpdateMutationMock } from './mocks'

export const TimePeriodDataKey = 'currentTimePeriod'
export const TimePeriodUpdateKey = 'updateTimePeriod'

export const TimePeriodQuery = {
  displayName: 'TimePeriodQuery',
  query: gql`
    query ${TimePeriodDataKey} {
      ${TimePeriodDataKey} @client {
        last
        start
        end
        daysNumber
      }
    }
  `,
  mockQueryFn: () => TimePeriodQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}

export const TimePeriodUpdateMutation = {
  displayName: 'TimePeriodUpdateMutation',
  mutation: gql`
    mutation ${TimePeriodUpdateKey}($last: TimePeriod, $start: String, $end: String, $daysNumber: Int) {
      ${TimePeriodUpdateKey}(last: $last, start: $start, end: $end, daysNumber: $daysNumber) @client {
        last
        start
        end
        daysNumber
      }
    }
  `,
  mockMutationFn: () => TimePeriodUpdateMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}
