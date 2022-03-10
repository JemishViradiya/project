import { FILTER_TYPES, meetsFilter } from '@ues/behaviours'

export const applyFilters = (activeFilters: any, data: any) => {
  if (activeFilters && Object.keys(activeFilters).length > 0 && data.length > 0) {
    let filteredData = data
    Object.entries(activeFilters).forEach(([key, filter]: any[]) => {
      const { operator, value } = filter
      filteredData = filteredData.filter(geozone => meetsFilter(geozone[key], { value, operator }, FILTER_TYPES.QUICK_SEARCH))
    })
    return filteredData
  } else {
    return data
  }
}
