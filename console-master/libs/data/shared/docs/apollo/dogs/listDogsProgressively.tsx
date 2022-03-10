import { gql } from '@apollo/client'

import type { ApolloQuery, Permission } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import type { Dog, DogProgressiveVariables } from '../../common'
import type { MoreDataResult } from '../../util'
import { getMockMoreData } from '../../util'

export const listDogsProgressively: ApolloQuery<MoreDataResult<Dog>, DogProgressiveVariables> = {
  query: gql`
    query getMoreDogs($limit: Int, $offset: Int) {
      data(limit: $limit, offset: $offset) {
        id
        name
        breed
      }
      pageInfo {
        limit
        offset
        hasMore
      }
    }
  `,
  permissions: new Set<Permission>(),
  defaultVariables: { limit: 3, offset: 0 },
  mockQueryFn: ({ limit, offset }) => {
    if (offset < 0) throw new Error('Invalid Request')
    return getMockMoreData<Dog>(limit, offset)
  },
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
}
