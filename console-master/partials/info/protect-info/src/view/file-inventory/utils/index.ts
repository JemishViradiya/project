enum FilterQueryKey {
  'name',
  'size',
  'infoTypes',
  'dataEntitiesCount',
  'policiesCount',
}

type FilterQueryValue = {
  operator: string
  value: string
}

interface ActiveFilters {
  FilterQueryKey: FilterQueryValue
}

export const buildFileInventoryListQuery = (activeFilters: ActiveFilters | Partial<ActiveFilters>) => {
  let filterQuery = {}
  Object.entries(activeFilters).forEach(filter => {
    filterQuery = { ...filterQuery, [filter[0]]: `${filter[1].value}` }
  })
  return filterQuery
}

export const buildFileInventorySearchQuery = (activeFilters: ActiveFilters | Partial<ActiveFilters>, location) => {
  let searchQuery = []
  const params = new URLSearchParams(location.search)

  Object.entries(activeFilters).forEach(filter => {
    searchQuery = [...searchQuery, [filter[0], filter[1].value]]
  })

  searchQuery.forEach(filter => {
    params.set(filter[0], filter[1])
  })

  return params
}
