import moment from 'moment'

import type { AsyncQuery } from '@ues-data/shared'
import type { Permission } from '@ues-data/shared-types'
import type { TableColumn, TableSortDirection } from '@ues/behaviours'
import { meetsFilter, sortHandler } from '@ues/behaviours'

import { DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE } from './table.constants'
import { getMockData } from './table.data'

// calculate the row data to return for the current page
const getPagedRows = (rowData = [], rowsPerPage = DEFAULT_ROWS_PER_PAGE, currentPage = DEFAULT_PAGE) => {
  // make sure it's always 1 and above
  // and is converted to zero-based number
  const page = Math.max(currentPage, DEFAULT_PAGE) - 1

  return rowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
}

const getFilteredRows = (data, activeFilters, columns) => {
  if (!activeFilters || !data || Object.keys(activeFilters).length < 1) {
    return data
  }
  return data.filter(row => {
    let show = true
    Object.keys(row).forEach(key => {
      if (
        activeFilters[key] !== undefined &&
        !meetsFilter(row[key], activeFilters[key], columns.find(c => c.dataKey === key).filterType)
      ) {
        show = false
      }
    })

    return show
  })
}

const getSortedRows = (rowData, sortProperty, sortDirection) => {
  const rowDataCopy = [...rowData]
  const sortDates = (dateA, dateB) => {
    const momentA = moment(dateA)
    const momentB = moment(dateB)

    if (momentA.isSameOrBefore(momentB)) {
      return sortDirection === 'asc' ? -1 : 1
    }

    if (momentA.isSameOrAfter(momentB)) {
      return sortDirection === 'asc' ? 1 : -1
    }
  }

  const sortNumbers = (numberA, numberB) => {
    if (sortDirection === 'asc') {
      return numberA - numberB
    }

    return numberB - numberA
  }

  rowDataCopy.sort((rowA, rowB) => {
    const dataA = rowA[sortProperty]
    const dataB = rowB[sortProperty]

    const isNumber = !isNaN(dataA)
    if (isNumber) {
      return sortNumbers(dataA, dataB)
    }

    // moment is considering values like "cupcake 1", "cupcake 2" as
    // january, feb, respectively, so they end up being considered
    // "valid". At the same time, values like "cupcake 13" and "cupcake 14"
    // are invalid (as expected), because the value > 12 ("after" december).
    // This one-off check for sortProperty !== 'name' is to ensure
    // that those string values never get interpreted as "dates",
    // so that the string comparison logic is used as expected.
    // Of course, this means that any new/additional string columns
    // with values ending in numbers <= 12 need to be added to this check
    // here too.
    const isDate = moment(dataA).isValid() && sortProperty !== 'name'
    if (isDate) {
      return sortDates(dataA, dataB)
    }

    const compareResult = dataA.toLocaleLowerCase().localeCompare(dataB.toLocaleLowerCase())

    if (sortDirection === 'desc') {
      return -compareResult
    }

    return compareResult
  })

  return rowDataCopy
}

const generatedData = getMockData()

const fetchPageData = {
  permissions: new Set<Permission>(),
  query: async ({ limit, page, sortBy, sortDir }) => {
    try {
      const sortedData = sortHandler(generatedData, { sortBy, sortDir })
      return page !== undefined ? getPagedRows(sortedData, limit, page) : sortedData
    } catch (e) {
      throw Object.assign(new Error(e.message), {
        limit,
        page,
        statusCode: 404,
      })
    }
  },
  mockQueryFn: ({ limit, page, sortBy, sortDir }) => {
    const sortedData = sortHandler(generatedData, { sortBy, sortDir })
    return page !== undefined ? getPagedRows(sortedData, limit, page) : sortedData
  },
}

export interface InfiniteTableItem {
  calories: string
  fat: string
  carbs: string
  protein: string
  isYummy: boolean
  dateModified: Date
  dateCreated: Date
  lastEaten: Date
}

export interface InfiniteTableResponse {
  elements: InfiniteTableItem[]
  total: number
}

interface InfiniteTableVariables {
  startIndex: number
  stopIndex: number
  batchSize?: number
  sortBy?: string
  sortDir?: TableSortDirection
  filters?: any
  columns?: TableColumn[]
}

const fetchInfiniteData: AsyncQuery<InfiniteTableResponse, InfiniteTableVariables> = {
  query: async ({ startIndex = 0, stopIndex = 30, sortBy, sortDir, filters, columns }) => {
    try {
      const filteredData = filters ? getFilteredRows(generatedData, filters, columns) : generatedData
      const sortedData = sortHandler(filteredData, { sortBy, sortDir })
      return { elements: sortedData.slice(startIndex, stopIndex + 1), total: filteredData.length } as InfiniteTableResponse
    } catch (e) {
      throw Object.assign(new Error(e.message), {
        startIndex,
        stopIndex,
        statusCode: 404,
      })
    }
  },
  permissions: new Set<Permission>(),
  mockQueryFn: null,
}
fetchInfiniteData.mockQueryFn = fetchInfiniteData.query

const fetchInfiniteExportData: AsyncQuery<InfiniteTableResponse, InfiniteTableVariables> = {
  ...fetchInfiniteData,
  iterator: ({ startIndex, stopIndex, batchSize, ...rest }, data) => {
    if (data) {
      const { total } = data
      const newStartIndex = startIndex + batchSize
      if (newStartIndex >= total) return null
      return { startIndex: newStartIndex, stopIndex: stopIndex + batchSize, batchSize, ...rest }
    }
    return { startIndex, stopIndex, ...rest }
  },
}

const fetchXGridData = {
  // eslint-disable-next-line sonarjs/no-identical-functions
  query: async ({ startIndex = 0, stopIndex = 30, sortBy, sortDir, filters, columns }) => {
    try {
      console.log(`start index=${startIndex}, stop index=${stopIndex}`)
      const filteredData = filters ? getFilteredRows(generatedData, filters, columns) : generatedData
      const sortedData = sortBy ? sortHandler(filteredData, { sortBy, sortDir }) : filteredData
      return { elements: sortedData.slice(startIndex, stopIndex + 1), total: filteredData.length }
    } catch (e) {
      throw Object.assign(new Error(e.message), {
        startIndex,
        stopIndex,
        statusCode: 404,
      })
    }
  },
  // eslint-disable-next-line sonarjs/no-identical-functions
  mockQueryFn: ({ startIndex = 0, stopIndex = 20, sortBy, sortDir, filters, columns }) => {
    console.log(`start index=${startIndex}, stop index=${stopIndex}`)
    const filteredData = filters ? getFilteredRows(generatedData, filters, columns) : generatedData
    const sortedData = sortBy ? sortHandler(filteredData, { sortBy, sortDir }) : filteredData
    console.log(`Data size: ${sortedData.slice(startIndex, stopIndex + 1).length}`)
    return { elements: sortedData.slice(startIndex, stopIndex), total: filteredData.length }
  },
}

export { getPagedRows, getFilteredRows, getSortedRows, fetchPageData, fetchInfiniteData, fetchInfiniteExportData, fetchXGridData }
