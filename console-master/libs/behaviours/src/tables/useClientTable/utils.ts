// dependencies
import cond from 'lodash/cond'
import flow from 'lodash/flow'
import isEmpty from 'lodash/isEmpty'
import reduce from 'lodash/reduce'

import type { TableColumn } from './../../components/Table'
import { getSorting, stableSort } from './../../functions'
import type { SORT_DIRECTION } from './../useSort'
// utils
import { meetsFilter } from './meetsFilter'

/**
 * Returns a tuple for a `cond` that evaluates a
 * flat list of primative data (i.e. an array of strings)
 */
const evaluateFlatData = (
  data: Array<any>,
  columns: Array<TableColumn>,
  activeFilters: Record<string, any>,
): [(val: any) => boolean, (val: any) => any] => [
  () => columns.length === 1 && columns[0].isFlat,
  () => data.filter(row => meetsFilter(row, activeFilters[columns[0].dataKey], columns[0].filterType)),
]

/**
 * Returns a tuple for a `cond` that evaluates a list of mapped data
 */
const evaluateMappedData = (
  data: Array<Record<string, any>>,
  columns: Array<TableColumn>,
  activeFilters: Record<string, any>,
): [(val: any) => boolean, (val: any) => any] => {
  // helper to determine if `row` should be included
  // or not based on the state of `activeFilters`
  const shouldIncludeRow = row =>
    reduce(
      row,
      (shouldInclude, value, key) =>
        cond([
          [
            // no filter set for this key => yes
            () => shouldInclude && isEmpty(activeFilters[key]),
            () => true,
          ],
          [
            // filter set for this key => does row value meet filter?
            () =>
              shouldInclude &&
              meetsFilter(value, activeFilters[key], (columns.find(col => col.dataKey === key) as TableColumn).filterType as any),
            () => true, // yes
          ],
          [
            // else: no
            () => true,
            () => false,
          ],
        ])(undefined),
      true,
    )

  return [() => columns.length > 0, () => data.filter(shouldIncludeRow)]
}

/**
 * Applies filtering on `data` as determined by the values of `activeFilters`
 */
const applyFilter = (data: any, columns: Array<TableColumn>, activeFilters: Record<string, unknown>) =>
  cond([
    [
      () => !isEmpty(activeFilters),
      () =>
        cond([
          evaluateFlatData(data, columns, activeFilters),
          evaluateMappedData(data, columns, activeFilters),
          // fallback: if the following clause executes `columns` is invalid
          [() => true, () => data],
        ])(undefined),
    ],
    [() => true, () => data],
  ])(undefined)

/**
 * Applies sort and pagination to `data`
 */
const applySortAndPagination = (
  data: Array<unknown>,
  sort: string,
  sortDirection: SORT_DIRECTION,
  page: number,
  rowsPerPage: number,
) =>
  flow([
    newData =>
      cond([
        [() => typeof sort === 'string' && !isEmpty(sort), () => stableSort(newData, getSorting(sortDirection, sort))],
        [() => true, () => newData],
      ])(undefined),
    newData =>
      cond([
        [() => typeof page === 'number' && page >= 0, () => newData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)],
        [() => true, () => newData],
      ])(undefined),
  ])(data)

const applyMultiColumnSearch = (data: Array<any>, columns: Array<TableColumn>, multiColumnSearch) => {
  const shouldIncludeRow = row =>
    reduce(
      row,
      (shouldInclude, value, key) =>
        cond([
          [() => shouldInclude, () => true],
          [
            () =>
              multiColumnSearch.fields.includes(key) &&
              meetsFilter(value, multiColumnSearch, (columns.find(col => col.dataKey === key) as TableColumn).filterType),
            () => true,
          ],
          [() => true, () => false],
        ])(undefined),
      false,
    )

  return cond([
    [() => !isEmpty(multiColumnSearch), () => data.filter(shouldIncludeRow)],
    [() => true, () => data],
  ])(undefined)
}

export { evaluateFlatData, evaluateMappedData, applyFilter, applySortAndPagination, applyMultiColumnSearch }
