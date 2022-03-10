import React from 'react'

import NullCell from '../NullCell'
import ValueCell from '../ValueCell'

const TextCell = props => {
  const { row } = props
  const value = typeof props.value === 'undefined' ? row.value : props.value

  let cell = <NullCell />

  if (value !== null && typeof value !== 'object' && typeof value !== 'undefined') {
    cell = <ValueCell value={value} />
  }
  return cell
}

export default TextCell
