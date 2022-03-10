import { gql } from '@apollo/client'

import type { ApolloMutation } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import type { Dog, DogVariables } from '../../common'

export const mutateDog: ApolloMutation<{ dog: Dog }, Partial<Dog> & DogVariables> = {
  mutation: gql`
    mutation updateDog($name: String!) {
      dog: updateDog(name: $name) {
        id
        name
        breed
      }
    }
  `,
  mockMutationFn: dog => {
    if (dog.name === 'Buck') {
      return { dog: { id: '1', name: 'Buck', breed: 'mock.bulldog', ...dog } }
    }
    throw new Error('not found')
  },
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
}
