interface UseServerTableParams<TData extends Record<string, unknown>> {
  tableData: TData[]
  dataDispatch: (params: unknown) => void
  page?: number
  rowsPerPage?: number
  sort?: string
  sortDirection?: string
  setSelected?: (selected: string[]) => void
}

export { UseServerTableParams }
