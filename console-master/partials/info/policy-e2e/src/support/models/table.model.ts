import { ARIA_LABELS, ROLES } from '../constants/selectors'

const table = tableName => I.findByLabelText(tableName)

const getRowGroupByName = name => I.findByRole(ROLES.ROW_GROUP, { name: name })

const getColumnHeaderByName = name => I.findByRole(ROLES.COLUMN_HEADER, { name: name })

const getColumnsOfTableHeaders = () => I.findAllByRole(ROLES.COLUMN_HEADER)

const getTableRowByName = name => I.findByRole(ROLES.ROW, { name })

const getTableRowByIndex = (index: number) => I.findAllByRole(ROLES.ROW).get(`[aria-rowindex=${index}]`)

const getRowByLabel = label => I.findByRole(ROLES.ROW, { name: label })

const getCellByIndex = (index: number) => I.findAllByRole(ROLES.CELL).get(`[aria-colindex=${index}]`)

const getCellByName = name => I.findByRole(ROLES.CELL, { name: name })

const getCheckboxByIndex = (index: number) => I.findByRoleOptionsWithin(ROLES.CELL, { name: `select-${index}` }, ROLES.CHECKBOX)

const getCheckboxForSelectAll = () => I.findByRole(ROLES.CELL, { name: I.translate(ARIA_LABELS.SELECT_ALL) })

const getColumnFilter = () => I.findByRole(ROLES.CELL, { name: ARIA_LABELS.COLUMN_PICKER })

const getGridcellByName = name => I.findByRole(ROLES.GRIDCELL, { name: name })

export const TableModel = {
  table,
  getRowGroupByName,
  getColumnHeaderByName,
  getColumnsOfTableHeaders,
  getTableRowByName,
  getTableRowByIndex,
  getRowByLabel,
  getCellByIndex,
  getCellByName,
  getCheckboxByIndex,
  getCheckboxForSelectAll,
  getColumnFilter,
  getGridcellByName,
}
