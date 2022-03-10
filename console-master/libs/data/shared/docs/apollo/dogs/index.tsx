import type {
  Dog as DogType,
  DogPageVariables as DogPageVariablesType,
  DogProgressiveVariables as DogProgressiveVariablesType,
} from '../../common'

export type Dog = DogType
export type DogProgressiveVariables = DogProgressiveVariablesType
export type DogPageVariables = DogPageVariablesType

export * from './listDogsByPage'
export * from './listDogsProgressively'
