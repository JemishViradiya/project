import type { Dog as DogType } from '../../common'

/* construct a modular data namespace */

export type Dog = DogType

export * from './queryDog'
export * from './mutateDog'
