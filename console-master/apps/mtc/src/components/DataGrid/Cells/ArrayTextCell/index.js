import React from 'react'

import NullCell from '../NullCell'
import ValueCell from '../ValueCell'

/**
 * ArrayTextCell Component
 *
 * @description If the cell value is returned from the API as an Array this component
 * will join the values into a comma separated string to be rendered to a data grid cell
 * or it will accept an array of indices of the values you want to join together
 * @param {Array?} indices
 * @param {Object} row
 */
const ArrayTextCell = props => {
  const { row, indices } = props
  let value = typeof props.value === 'undefined' ? row.value : props.value
  let cell = <NullCell />

  if (!indices && Array.isArray(value)) {
    value = value.join(', ')
  } else if (indices) {
    value = indices.map(index => value[index]).join(', ')
  }

  if (value !== null && typeof value !== 'object' && typeof value !== 'undefined') {
    cell = <ValueCell value={value} />
  }
  return cell
}

export default ArrayTextCell
