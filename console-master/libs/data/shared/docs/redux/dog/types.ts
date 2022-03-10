import type { StatefulResult, UesReduxSlices } from '@ues-data/shared'

import type { Dog as CommonDog } from '../../common'

export const ReduxSlice: UesReduxSlices = 'example.redux.dog'

export const ActionTypes = {
  fetch: `${ReduxSlice}/FETCH` as const,
  update: `${ReduxSlice}/UPDATE` as const,
  success: `${ReduxSlice}/FETCH_SUCCESS` as const,
  failure: `${ReduxSlice}/FETCH_FAILURE` as const,
} as const
export type ActionTypes = typeof ActionTypes[keyof typeof ActionTypes]

// Types
export type Dog = CommonDog
export type DogVariables = { name: string }

export type State = StatefulResult<Dog> & { meta?: DogVariables; error?: Error }
