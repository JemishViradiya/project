import type { Permission, ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { UesReduxStore } from '@ues-data/shared'

import { searchDog, updateDog } from './actions'
import { reducer } from './reducer'
import { selectDogState } from './selectors'
import type { Dog as DogType, DogVariables as DogVariablesType } from './types'
import { ReduxSlice } from './types'

/* opt into lazy loading of our slice, since we have set `slice` below */
const slice = UesReduxStore.registerSlice(ReduxSlice, { reducer }, { eager: false })

export type Dog = DogType
export type DogVariables = DogVariablesType

/* Optinal: export selectors as part of the public api */
export * from './selectors'

export const queryDog: ReduxQuery<Dog, DogVariables> = {
  slice,
  permissions: new Set<Permission>(),
  query: searchDog,
  selector: () => selectDogState,
  mockQueryFn: ({ name }) => {
    if (name === 'Buck') {
      return { id: '1', name: 'Buck', breed: 'mock.bulldog' }
    }
    throw new Error('not found')
  },
}

export const mutateDog: ReduxMutation<Dog, Partial<Dog> & Pick<Dog, 'name'>> = {
  slice,
  mutation: updateDog,
  selector: () => selectDogState,
  mockMutationFn: payload => {
    if (payload.name === 'Buck') return { id: '1', name: 'Buck', breed: 'mock.bulldog' }
    throw new Error('not found')
  },
}
