import { gql } from '@apollo/client'

import type { ApolloQuery, Permission } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import type { Dog, DogVariables } from '../../common'

export const queryDog: ApolloQuery<{ dog: Dog }, DogVariables> = {
  query: gql`
    query GetDog($name: String) {
      dog(name: $name) {
        id
        name
        breed
      }
    }
  `,
  permissions: new Set<Permission>(),
  defaultVariables: { name: 'Buck' },
  mockQueryFn: ({ name }) => {
    if (name === 'Buck') {
      return { dog: { id: '1', name: 'Buck', breed: 'mock.bulldog' } }
    }
    throw new Error('not found')
  },
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
}
