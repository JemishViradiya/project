import { TEMPLATE_FIELDS } from '@ues-data/dlp'
import { serializeQueryParameter } from '@ues-data/shared'

type FilterQueryValue = {
  operator: string
  value: string
}

interface ActiveFilters {
  FilterQueryKey: FilterQueryValue
}
const QUERY_SEPARATOR = ','

export const buildTemplatesListQuery = (activeFilters: ActiveFilters | Partial<ActiveFilters>) => {
  let query = ''
  Object.entries(activeFilters).forEach(filter => {
    if (query !== '') query += QUERY_SEPARATOR
    // should be fix in scoupe of 4898 Jira - ticket (case sensetive validation from server side)
    // if (filter[1].value === 'Australia') filter[1].value = '*AUSTRALIA*'
    const key = filter[0]
    const filterValue =
      filter[0] === TEMPLATE_FIELDS.INFO_TYPES ? { ...filter[1], value: filter[1].value.toUpperCase() } : filter[1]
    query += serializeQueryParameter(key, filterValue)
  })
  return query
}
