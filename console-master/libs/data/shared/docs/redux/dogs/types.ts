import type { StatefulResult, UesReduxSlices } from '@ues-data/shared'

import type { Dog as CommonDog } from '../../common'

export const ReduxSlice: UesReduxSlices = 'example.redux.dogs'

export const ActionTypes = {
  fetch: `${ReduxSlice}/FETCH` as const,
  update: `${ReduxSlice}/UPDATE` as const,
  success: `${ReduxSlice}/FETCH_SUCCESS` as const,
  failure: `${ReduxSlice}/FETCH_FAILURE` as const,
} as const
export type ActionTypes = typeof ActionTypes[keyof typeof ActionTypes]

// Types
export type Dog = CommonDog
export type DogPageVariables = { limit: number; page: number }
export type DogPageResult = {
  data: Dog[]
  pageInfo: DogPageVariables & {
    hasMore?: boolean
  }
}

export type DogProgressiveVariables = { limit: number; offset: number }
export type DogProgressiveResult = {
  data: Dog[]
  pageInfo: DogProgressiveVariables & {
    hasMore?: boolean
  }
}

export type State = Partial<StatefulResult<DogPageResult | DogProgressiveResult>> & {
  meta?: DogPageVariables | DogProgressiveVariables
}
