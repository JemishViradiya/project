export type { IDeveloperCertificate } from './exclusions/api/dev-certs/dev-certs-api-types'
export type { IAppInfo } from './exclusions/api/applications/applications-api-types'

export interface Response<TData> {
  data?: TData
}

export interface PageableSortableQueryParams<TData> {
  max?: number
  offset?: number
  query?: Partial<TData>
  sortBy?: string
}

export interface EntitiesPageableResponse<TData> {
  totals: {
    pages: number
    elements: number
  }
  navigation: {
    next: string
    previous: string
  }
  count: number
  elements: TData[]
}

export interface PagedResponse<TData> {
  next: string
  elements: TData[]
}

export interface BulkDeleteResponse {
  totalRequested: number
  totalProcessed: number
}

export interface CsvResult<TData> {
  successes: number
  failures: TData[]
}

export interface CsvRecordFailure {
  recordNumber: number
  errorInfo: {
    subStatusCode: number
    message: string
    params: any[]
  }
}

export interface Task<TResult = unknown> extends Response<TResult> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export default void 0
