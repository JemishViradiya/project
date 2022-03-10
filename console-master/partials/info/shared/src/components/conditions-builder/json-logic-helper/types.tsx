//Action Types
export const DELETE_RULE = 'DELETE_RULE'
export const DELETE_GROUP = 'DELETE_GROUP'
export const ADD_RULE = 'ADD_RULE'
export const ADD_GROUP = 'ADD_GROUP'
export const UPDATE_RULE = 'UPDATE_RULE'
export const UPDATE_GROUP = 'UPDATE_GROUP'

export type ConditionsModel = {
  groups: Group[]
  rules: Rule[]
}

export type Group = {
  condition: string // Adjunction // and, or, not
  groups: number[]
  rules: number[]
  isDeleted: boolean
}

export type Rule = {
  titleGuid: string // data types guid
  operation: string // Operation // equal, great, less, greatOrEqual, lessOrEqual
  dataTypeName: string
  value: number
  isDeleted: boolean
}

export enum Adjunction {
  AND = 'and',
  OR = 'or',
  NOT = 'not',
}
export enum Operation {
  EQUAL = '==',
  GREAT = '>',
  LESS = '<',
  GREAT_OR_EQUAL = '>=',
  LESS_OR_EQAUAL = '<=',
}

export const VAR_KEY = 'var'
export const checkIfAdjunctionAllowed = (name: string) => Object.values(Adjunction).includes(name as any)
