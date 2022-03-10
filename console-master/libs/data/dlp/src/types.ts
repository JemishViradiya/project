import type { Action } from 'redux'

export enum DATA_TYPES {
  CUSTOM = 'CUSTOM',
  PREDEFINED = 'PREDEFINED',
}

export enum REGION {
  GLOBAL = 'Global',
  AUSTRALIA = 'Australia',
  CANADA = 'Canada',
  EUROPEAN_UNION = 'Europian Union',
  INDIA = 'India',
  UNITED_KINGDOM = 'United Kingdom',
  USA = 'United States',
}

export enum STATUS {
  IN_USE = 'in use',
  NOT_IN_USE = 'not in use',
}

export enum INFO_TYPES {
  CUSTOM = 'custom',
  FINANCE = 'finance',
  HEALTH = 'health',
  PRIVACY = 'privacy',
}

export enum ALGORITHM {
  KEYWORD = 'keywords',
  EXPRESSION = 'expression',
}

export type DataEntity = {
  guid?: string
  name: string
  algorithm: string
  parameters: any
  description?: string | string[]
  type?: DATA_TYPES
  regions: string
  infoTypes: string
  created?: string
  updated?: string
}

export interface PageableSortableQueryParams<TData> {
  max?: number
  offset?: number
  query?: Partial<TData>
  sortBy?: string
  cursor?: string
}

export interface PageableSortableQueryParamsWithPolicesAssignment<TData> extends PageableSortableQueryParams<TData> {
  policiesAssignment?: boolean
}

export interface PageableSortableEventsQueryParams<TData> extends PageableSortableQueryParams<TData> {
  limit?: number
  startTime?: string
  stopTime?: string
  eventType?: string
}

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export interface PageableSortableFileInventoryQueryParams<TData> extends PageableSortableQueryParams<TData> {
  infoTypes?: string
}
