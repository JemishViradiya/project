import type { Dog as DogType, DogVariables as DogVariablesType } from '../../common'

export type Dog = DogType
export type DogVariables = DogVariablesType
export type DogResult = { dog: Dog }

export * from './queryDog'
export * from './mutateDog'
