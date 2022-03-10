import type { Permission, ReduxQuery } from '@ues-data/shared'
import { UesReduxStore } from '@ues-data/shared'

import { getMockPageData } from '../../util'
import { listDogsPage, listDogsProgressive } from './actions'
import { reducer } from './reducer'
import { selectDogPageState, selectDogProgressiveState } from './selectors'
import type {
  Dog,
  DogPageResult as DogPageResultType,
  DogPageVariables as DogPageVariablesType,
  DogProgressiveResult as DogProgressiveResultType,
  DogProgressiveVariables as DogProgressiveVariablesType,
} from './types'
import { ReduxSlice } from './types'

/* opt into lazy loading of our slice, since we have set `slice` below */
const slice = UesReduxStore.registerSlice(ReduxSlice, { reducer }, { eager: false })

export type DogPageResult = DogPageResultType
export type DogPageVariables = DogPageVariablesType
export type DogProgressiveResult = DogProgressiveResultType
export type DogProgressiveVariables = DogProgressiveVariablesType

/* Optinal: export selectors as part of the public api */
export * from './selectors'

export const listDogsByPage: ReduxQuery<DogPageResult, DogPageVariables> = {
  slice,
  permissions: new Set<Permission>(),
  query: listDogsPage,
  selector: selectDogPageState,
  mockQueryFn: ({ limit, page }: { limit: number; page: number }) => {
    console.log('mockQueryFn', limit, page)
    if (page < 1) throw new Error('Invalid Request')
    return getMockPageData<Dog>(limit, page)
  },
}

export const listDogsProgressively: ReduxQuery<DogProgressiveResult, DogProgressiveVariables> = {
  slice,
  permissions: new Set<Permission>(),
  query: listDogsProgressive,
  selector: selectDogProgressiveState,
  mockQuery: listDogsProgressive,
}
