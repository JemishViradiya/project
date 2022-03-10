import type { AlertsApi, AlertsMockApi } from './alert-service'
import type { ModelsApi, ModelsMockApi } from './model-service'
import type { UsersApi, UsersMockApi } from './user-service'
import type { ZonesApi, ZonesMockApi } from './zone-service'

export interface ListRequestParams {
  page?: number
  rowsPerPage?: number
  sort?: string
  sortDirection?: 'asc' | 'desc'
  filters?: Record<string, string | string[]>[]
  includeMeta?: boolean
}

export interface PaginatedMeta {
  page: number
  pageSize: number
  lastPage: number
  total: number
}

export interface PaginatedResponse<Row = unknown> {
  data: Row[]
  meta: PaginatedMeta
}

export interface KeyValuePair {
  [key: string]: string
}

export interface StatisticsCountItem {
  timestamp: string
  count: number
}

export interface StatisticsCountResponse {
  count: StatisticsCountItem[]
}

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export type StatisticsTimeInterval = 'day' | 'hour'

export type UsersApiProvider = typeof UsersApi | typeof UsersMockApi
export type AlertsApiProvider = typeof AlertsApi | typeof AlertsMockApi
export type ModelsApiProvider = typeof ModelsApi | typeof ModelsMockApi
export type ZonesApiProvider = typeof ZonesApi | typeof ZonesMockApi
