import { serializeQueryParameter } from '@ues-data/shared'

enum FilterQueryKey {
  'name',
  'classification',
  'description',
}

type FilterQueryValue = {
  operator: string
  value: string
}

interface ActiveFilters {
  FilterQueryKey: FilterQueryValue
}
const QUERY_SEPARATOR = ','

export const buildPoliciesListQuery = (activeFilters: ActiveFilters | Partial<ActiveFilters>) => {
  let query = ''
  Object.entries(activeFilters).forEach(filter => {
    if (query !== '') query += QUERY_SEPARATOR
    const key = filter[0] === 'name' ? 'policyName' : filter[0]
    const filterValue = filter[0] === 'classification' ? { ...filter[1], value: filter[1].value.toUpperCase() } : filter[1]
    query += serializeQueryParameter(key, filterValue)
  })
  return query
}
