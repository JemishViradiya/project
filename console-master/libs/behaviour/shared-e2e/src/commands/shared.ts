/* eslint-disable no-restricted-globals */

export function findAllByInfiniteTableColumnLabel(colLabel) {
  I.findByRole('columnheader', { name: colLabel })
    .findByRole('cell')
    .then(cell => {
      const colIndex = cell.prop('ariaColIndex') || cell.attr('aria-colindex')
      return I.findAllByRole('cell').filter(`[aria-colindex=${colIndex}]`)
    })
}

export function findSortButtonByInfiniteTableColumnLabel(colLabel) {
  return I.findAllByRole('columnheader').findByRole('button', { name: colLabel })
}

export function findByInfiniteTableCell(rowIndex, colIndex) {
  return I.findAllByRole('row')
    .filter(`[aria-rowindex=${rowIndex}]`)

    .findAllByRole('cell')
    .filter(`[aria-colindex=${colIndex}]`)
}

export function findByXGridHeader(colIndex) {
  return I.findAllByRole('row')
    .filter(`[aria-rowindex=1]`)

    .findAllByRole('columnheader')
    .filter(`[aria-colindex=${colIndex}]`)
}

export function findAllByTableColumnLabel(colLabel, index) {
  I.findByRole('columnheader', { name: colLabel }).then(cell => {
    const colIndex = index ?? (cell.prop('ariaColIndex') || cell.attr('aria-colindex'))
    return I.findAllByRole('cell').filter(`[aria-colindex=${colIndex}]`)
  })
}

export function findByRoleWithin(container, role, options) {
  return I.findByRole(container).findByRole(role, options)
}

export function findByRoleOptionsWithin(container, containerOptions, role, options) {
  return I.findByRole(container, containerOptions).findByRole(role, options)
}

export function dismissAlert() {
  return I.findByRole('alert').findByRole('button').click()
}

export function changeSelectValue(selectLabel, visibleValueToSelect) {
  I.findByLabelText(selectLabel).click()
  I.findByRoleOptionsWithin('listbox', { name: selectLabel }, 'option', {
    name: visibleValueToSelect,
  }).click()
}
