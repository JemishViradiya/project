import { gql } from '@apollo/client'

import type { ApolloQuery, Permission } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import type { Dog, DogPageVariables } from '../../common'
import type { PageDataResult } from '../../util'
import { getMockPageData } from '../../util'

export const listDogsByPage: ApolloQuery<PageDataResult<Dog>, DogPageVariables> = {
  query: gql`
    query getPageDogs($limit: Int, $page: Int) {
      data(limit: $limit, page: $page) {
        id
        name
        breed
      }
      pageInfo {
        limit
        page
        prev
        next
      }
    }
  `,
  permissions: new Set<Permission>(),
  defaultVariables: { limit: 3, page: 1 },
  mockQueryFn: ({ limit, page }) => {
    if (page < 1) throw new Error('Invalid Request')
    return getMockPageData<Dog>(limit, page)
  },
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
}
