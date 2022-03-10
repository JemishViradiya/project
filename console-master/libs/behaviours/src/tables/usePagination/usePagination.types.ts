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
