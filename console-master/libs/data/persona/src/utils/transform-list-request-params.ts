import type { ListRequestParams } from '../types'

const resolveFilterValues = (filters: Record<string, string | string[]>[]) => {
  return filters.reduce((acc, filter) => ({ ...acc, ...filter }), {})
}

export const transformListRequestParams = ({ page, rowsPerPage, sort, sortDirection, includeMeta, filters }: ListRequestParams) => {
  let resultParams = {}

  if (sort) {
    const directionPrefix = sortDirection === 'desc' ? '-' : ''

    resultParams = {
      ...resultParams,
      sort: `${directionPrefix}${sort}`,
    }
  }

  if (includeMeta) {
    resultParams = {
      ...resultParams,
      includeMeta,
    }
  }

  if (page >= 0) {
    resultParams = {
      ...resultParams,
      page,
      pageSize: rowsPerPage,
    }
  }

  if (filters) {
    resultParams = {
      ...resultParams,
      ...resolveFilterValues(filters),
    }
  }

  return resultParams
}
